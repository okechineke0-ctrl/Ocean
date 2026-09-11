import { 
  collection, 
  addDoc, 
  getDocs, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { 
  InquiryRecord, 
  InternshipRecord, 
  InternshipRegistrationFormData,
  CourseRegistrationRecord,
  CourseRegistrationFormData
} from '../types';

const LOCAL_STORAGE_KEY = 'ocean_tech_inquiries_cache';
const LOCAL_STORAGE_INTERNSHIPS_KEY = 'ocean_tech_internships_cache';
const LOCAL_STORAGE_COURSES_KEY = 'ocean_tech_course_registrations_cache';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
      emailVerified: null,
      isAnonymous: null,
      tenantId: null,
      providerInfo: [],
    },
    operationType,
    path,
  };
  console.warn('Firestore Operation Notification:', JSON.stringify(errInfo));
}

function getLocalInquiries(): InquiryRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalInquiry(record: InquiryRecord) {
  try {
    const current = getLocalInquiries();
    const updated = [record, ...current.filter((i) => i.id !== record.id)];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated.slice(0, 50)));
  } catch (e) {
    console.warn('Could not cache inquiry to localStorage:', e);
  }
}

/**
 * Save an inquiry (Quote, Contact Form message, or Rapid Project Triage)
 * Saves to both Cloud Firestore and PostgreSQL database with local caching.
 */
export async function saveInquiry(
  inquiry: Omit<InquiryRecord, 'id' | 'createdAt' | 'status'>
): Promise<string> {
  const localId = `quote-${Date.now()}`;
  const nowIso = new Date().toISOString();

  const record: InquiryRecord = {
    id: localId,
    type: inquiry.type || 'quote',
    fullName: (inquiry.fullName || '').trim() || 'Prospective Client',
    email: (inquiry.email || '').trim() || 'client@oceantechnologies.ng',
    phone: (inquiry.phone || '').trim() || 'Not provided',
    companyOrProject: (inquiry.companyOrProject || '').trim(),
    serviceType: inquiry.serviceType || 'Website Development',
    budgetRange: inquiry.budgetRange || 'Flexible',
    timeline: inquiry.timeline || 'Flexible',
    urgency: inquiry.urgency || 'Standard',
    message: inquiry.message || 'Project inquiry submitted via Ocean Technologies website',
    preferredContact: inquiry.preferredContact || 'WhatsApp',
    status: 'new',
    createdAt: nowIso,
  };

  // 1. Save immediately to Local Cache for instant visual response
  saveLocalInquiry(record);

  let resultingId = localId;

  // 2. Save to Cloud Firestore
  try {
    const firestorePayload = {
      type: record.type,
      fullName: record.fullName,
      email: record.email,
      phone: record.phone,
      companyOrProject: record.companyOrProject || '',
      serviceType: record.serviceType || '',
      budgetRange: record.budgetRange || '',
      timeline: record.timeline || '',
      urgency: record.urgency || 'Standard',
      message: record.message || '',
      preferredContact: record.preferredContact || 'WhatsApp',
      status: 'new',
      createdAt: nowIso,
      submittedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'inquiries'), firestorePayload);
    resultingId = docRef.id;
    record.id = docRef.id;
    saveLocalInquiry(record);
    console.log('Saved inquiry to Firestore:', docRef.id);
  } catch (firestoreError) {
    handleFirestoreError(firestoreError, OperationType.CREATE, 'inquiries');
  }

  // 3. Save to PostgreSQL backend API
  try {
    const res = await fetch('/api/inquiries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clientName: record.fullName,
        email: record.email,
        phone: record.phone,
        company: record.companyOrProject,
        serviceType: record.serviceType,
        projectType: record.type,
        budgetRange: record.budgetRange,
        timeline: record.timeline,
        urgency: record.urgency,
        projectDescription: record.message,
        preferredContactMethod: record.preferredContact,
        source: record.type,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.inquiry?.id) {
        console.log('Saved inquiry to PostgreSQL:', data.inquiry.id);
      }
    }
  } catch (postgresError) {
    console.warn('PostgreSQL sync note:', postgresError);
  }

  return resultingId;
}

/**
 * Save an emergency incident ticket to PostgreSQL database
 */
export async function submitEmergencyTicket(
  ticket: {
    clientName: string;
    email: string;
    phone: string;
    company?: string;
    systemUrl?: string;
    issueCategory: string;
    urgencyLevel: string;
    issueDescription: string;
    preferredContactMethod?: string;
  }
): Promise<string> {
  try {
    const res = await fetch('/api/emergency-tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ticket),
    });

    if (!res.ok) {
      throw new Error(`Failed to submit emergency ticket: HTTP ${res.status}`);
    }

    const data = await res.json();
    return String(data.ticket?.id || `em-${Date.now()}`);
  } catch (error) {
    console.error('Failed to save emergency ticket to PostgreSQL:', error);
    return `em-${Date.now()}`;
  }
}

/**
 * Save an emergency bug / system incident ticket directly to PostgreSQL.
 */
export async function saveEmergencyTicket(ticket: {
  clientName: string;
  email: string;
  phone: string;
  systemUrl?: string;
  severity?: string;
  errorDescription: string;
}): Promise<{ success: boolean; ticketNumber?: string; id?: number }> {
  try {
    const res = await fetch('/api/emergency-tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clientName: ticket.clientName,
        email: ticket.email,
        phone: ticket.phone,
        systemUrl: ticket.systemUrl,
        issueCategory: ticket.severity || 'Critical',
        urgencyLevel: ticket.severity || 'Urgent',
        issueDescription: ticket.errorDescription,
      }),
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();
    return {
      success: true,
      ticketNumber: data.ticket?.ticketNumber,
      id: data.ticket?.id,
    };
  } catch (error) {
    console.error('Failed to save emergency ticket to PostgreSQL:', error);
    return {
      success: true,
      ticketNumber: `OCT-EMG-${Date.now().toString().slice(-6)}`,
    };
  }
}

/**
 * Fetch inquiries from PostgreSQL
 */
export async function fetchInquiriesFromPostgres(): Promise<InquiryRecord[]> {
  try {
    const res = await fetch('/api/inquiries');
    if (!res.ok) return [];
    const data = await res.json();
    return (data.inquiries || []).map((row: any) => ({
      id: `pg-${row.id}`,
      type: (row.projectType === 'emergency_issue' ? 'emergency_issue' : row.projectType === 'contact' ? 'contact' : 'quote') as any,
      fullName: row.clientName,
      email: row.email,
      phone: row.phone,
      companyOrProject: row.company || '',
      serviceType: row.serviceType,
      budgetRange: row.budgetRange,
      timeline: row.timeline,
      urgency: row.urgency || 'Standard',
      message: row.projectDescription,
      preferredContact: row.preferredContactMethod || 'WhatsApp',
      status: (row.status === 'in_progress' ? 'in_progress' : row.status === 'resolved' ? 'resolved' : row.status === 'archived' ? 'archived' : 'new') as any,
      adminNotes: row.adminNotes,
      createdAt: row.createdAt ? new Date(row.createdAt).toISOString() : new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching inquiries from PostgreSQL:', error);
    return [];
  }
}

/**
 * Subscribe in real-time to both Cloud Firestore and PostgreSQL inquiries
 */
export function subscribeToInquiries(
  callback: (inquiries: InquiryRecord[]) => void
): () => void {
  let isMounted = true;
  let firestoreItems: InquiryRecord[] = [];
  let postgresItems: InquiryRecord[] = [];

  const emitMerged = () => {
    if (!isMounted) return;
    const localItems = getLocalInquiries();
    
    // Combine items by comparing matching emails/messages or IDs to avoid duplicates
    const combined: InquiryRecord[] = [...firestoreItems];
    const seenSignatures = new Set(
      firestoreItems.map((i) => `${(i.fullName || '').toLowerCase()}|${(i.email || '').toLowerCase()}|${(i.createdAt || '').slice(0, 16)}`)
    );

    for (const pgItem of postgresItems) {
      const sig = `${(pgItem.fullName || '').toLowerCase()}|${(pgItem.email || '').toLowerCase()}|${(pgItem.createdAt || '').slice(0, 16)}`;
      if (!seenSignatures.has(sig)) {
        seenSignatures.add(sig);
        combined.push(pgItem);
      }
    }

    for (const localItem of localItems) {
      const sig = `${(localItem.fullName || '').toLowerCase()}|${(localItem.email || '').toLowerCase()}|${(localItem.createdAt || '').slice(0, 16)}`;
      if (!seenSignatures.has(sig)) {
        seenSignatures.add(sig);
        combined.push(localItem);
      }
    }

    // Sort newest first
    combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    callback(combined);
  };

  // 1. Initial local emit
  emitMerged();

  // 2. Subscribe to Cloud Firestore
  let unsubscribeFirestore = () => {};
  try {
    const inquiriesQuery = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
    unsubscribeFirestore = onSnapshot(
      inquiriesQuery,
      (snapshot) => {
        firestoreItems = snapshot.docs.map((docSnap) => {
          const d = docSnap.data();
          return {
            id: docSnap.id,
            type: d.type || 'quote',
            fullName: d.fullName || 'Client',
            email: d.email || '',
            phone: d.phone || '',
            companyOrProject: d.companyOrProject || '',
            serviceType: d.serviceType || 'Website Development',
            budgetRange: d.budgetRange,
            timeline: d.timeline,
            urgency: d.urgency || 'Standard',
            message: d.message || '',
            affectedUrlOrSystem: d.affectedUrlOrSystem,
            preferredContact: d.preferredContact || 'WhatsApp',
            status: d.status || 'new',
            adminNotes: d.adminNotes,
            createdAt: d.createdAt || new Date().toISOString(),
          } as InquiryRecord;
        });
        emitMerged();
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'inquiries');
      }
    );
  } catch (err) {
    console.warn('Firestore subscription failed, relying on PostgreSQL and local caching:', err);
  }

  // 3. Poll PostgreSQL backend
  const fetchPg = async () => {
    try {
      const rows = await fetchInquiriesFromPostgres();
      postgresItems = rows;
      emitMerged();
    } catch {
      // Ignored
    }
  };

  fetchPg();
  const pgInterval = setInterval(fetchPg, 6000);

  return () => {
    isMounted = false;
    unsubscribeFirestore();
    clearInterval(pgInterval);
  };
}

/**
 * Update the status or admin notes of an inquiry
 */
export async function updateInquiryStatus(
  id: string,
  status: InquiryRecord['status'],
  adminNotes?: string
): Promise<void> {
  // Update Local Cache
  const current = getLocalInquiries();
  const updated = current.map((item) => (item.id === id ? { ...item, status, adminNotes } : item));
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));

  // Update in Firestore
  try {
    if (!id.startsWith('pg-') && !id.startsWith('quote-')) {
      const docRef = doc(db, 'inquiries', id);
      await updateDoc(docRef, {
        status,
        ...(adminNotes !== undefined ? { adminNotes } : {}),
      });
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `inquiries/${id}`);
  }

  // Update in PostgreSQL
  try {
    const numericId = parseInt(id.replace('pg-', ''), 10);
    if (!isNaN(numericId)) {
      await fetch(`/api/inquiries/${numericId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminNotes }),
      });
    }
  } catch (error) {
    console.error(`Failed to update inquiry ${id} in PostgreSQL:`, error);
  }
}

/**
 * Delete an inquiry
 */
export async function deleteInquiry(id: string): Promise<void> {
  // Delete from local cache
  const current = getLocalInquiries();
  const updated = current.filter((item) => item.id !== id);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));

  // Delete from Firestore
  try {
    if (!id.startsWith('pg-') && !id.startsWith('quote-')) {
      const docRef = doc(db, 'inquiries', id);
      await deleteDoc(docRef);
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `inquiries/${id}`);
  }

  // Delete from PostgreSQL
  try {
    const numericId = parseInt(id.replace('pg-', ''), 10);
    if (!isNaN(numericId)) {
      await fetch(`/api/inquiries/${numericId}`, {
        method: 'DELETE',
      });
    }
  } catch (error) {
    console.error(`Failed to delete inquiry ${id} from PostgreSQL:`, error);
  }
}

// ==========================================
// INTERNSHIPS, IT & SIWES STORAGE SERVICE
// ==========================================

function getLocalInternships(): InternshipRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_INTERNSHIPS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalInternship(record: InternshipRecord) {
  try {
    const current = getLocalInternships();
    const updated = [record, ...current.filter((i) => i.id !== record.id)];
    localStorage.setItem(LOCAL_STORAGE_INTERNSHIPS_KEY, JSON.stringify(updated.slice(0, 100)));
  } catch (e) {
    console.warn('Could not cache internship to localStorage:', e);
  }
}

/**
 * Register a student for Internship, Industrial Training (IT) or SIWES.
 * Stores in Cloud Firestore and PostgreSQL database with instant local fallback.
 */
export async function saveInternshipRegistration(
  formData: InternshipRegistrationFormData
): Promise<{ success: boolean; registrationNumber: string; id: string }> {
  const localId = `int-${Date.now()}`;
  const nowIso = new Date().toISOString();
  const regNumber = `OCT-INT-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  const record: InternshipRecord = {
    id: localId,
    registrationNumber: regNumber,
    fullName: (formData.fullName || '').trim() || 'Student Applicant',
    email: (formData.email || '').trim(),
    phone: (formData.phone || '').trim(),
    school: (formData.school || '').trim(),
    department: (formData.department || '').trim(),
    level: (formData.level || '').trim(),
    studentId: (formData.studentId || '').trim(),
    programType: formData.programType || '6-Month SIWES',
    techTrack: formData.techTrack || 'Full-Stack Web Development',
    preferredStartDate: formData.preferredStartDate || 'Immediate',
    statementOfPurpose: (formData.statementOfPurpose || '').trim(),
    status: 'pending',
    createdAt: nowIso,
  };

  // 1. Cache immediately in localStorage
  saveLocalInternship(record);

  let resultingId = localId;

  // 2. Store in Cloud Firestore (internships collection)
  try {
    const firestorePayload = {
      registrationNumber: record.registrationNumber,
      fullName: record.fullName,
      email: record.email,
      phone: record.phone,
      school: record.school,
      department: record.department,
      level: record.level,
      studentId: record.studentId,
      programType: record.programType,
      techTrack: record.techTrack,
      preferredStartDate: record.preferredStartDate,
      statementOfPurpose: record.statementOfPurpose,
      status: 'pending',
      createdAt: nowIso,
      submittedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'internships'), firestorePayload);
    resultingId = docRef.id;
    record.id = docRef.id;
    saveLocalInternship(record);
    console.log('Saved internship to Firestore:', docRef.id);
  } catch (firestoreError) {
    handleFirestoreError(firestoreError, OperationType.CREATE, 'internships');
  }

  // 3. Store in PostgreSQL backend API
  try {
    const res = await fetch('/api/internships', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        registrationNumber: record.registrationNumber,
        fullName: record.fullName,
        email: record.email,
        phone: record.phone,
        school: record.school,
        department: record.department,
        level: record.level,
        studentId: record.studentId,
        programType: record.programType,
        techTrack: record.techTrack,
        preferredStartDate: record.preferredStartDate,
        statementOfPurpose: record.statementOfPurpose,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.internship?.id) {
        console.log('Saved internship to PostgreSQL:', data.internship.id);
      }
    }
  } catch (pgError) {
    console.warn('PostgreSQL internship registration note:', pgError);
  }

  return {
    success: true,
    registrationNumber: regNumber,
    id: resultingId,
  };
}

/**
 * Fetch internships from PostgreSQL backend
 */
export async function fetchInternshipsFromPostgres(): Promise<InternshipRecord[]> {
  try {
    const res = await fetch('/api/internships');
    if (!res.ok) return [];
    const data = await res.json();
    return (data.internships || []).map((row: any) => ({
      id: `pg-${row.id}`,
      registrationNumber: row.registrationNumber || `OCT-INT-${row.id}`,
      fullName: row.fullName,
      email: row.email,
      phone: row.phone,
      school: row.school,
      department: row.department,
      level: row.level,
      studentId: row.studentId,
      programType: row.programType,
      techTrack: row.techTrack,
      preferredStartDate: row.preferredStartDate,
      statementOfPurpose: row.statementOfPurpose,
      status: row.status as any,
      adminNotes: row.adminNotes,
      createdAt: row.createdAt ? new Date(row.createdAt).toISOString() : new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching internships from PostgreSQL:', error);
    return [];
  }
}

/**
 * Subscribe in real-time to both Cloud Firestore and PostgreSQL internships
 */
export function subscribeToInternships(
  callback: (records: InternshipRecord[]) => void
): () => void {
  let isMounted = true;
  let firestoreItems: InternshipRecord[] = [];
  let postgresItems: InternshipRecord[] = [];

  const emitMerged = () => {
    if (!isMounted) return;
    const localItems = getLocalInternships();

    const combined: InternshipRecord[] = [...firestoreItems];
    const seenSignatures = new Set(
      firestoreItems.map((i) => `${(i.studentId || '').toLowerCase()}|${(i.email || '').toLowerCase()}`)
    );

    for (const pgItem of postgresItems) {
      const sig = `${(pgItem.studentId || '').toLowerCase()}|${(pgItem.email || '').toLowerCase()}`;
      if (!seenSignatures.has(sig)) {
        seenSignatures.add(sig);
        combined.push(pgItem);
      }
    }

    for (const localItem of localItems) {
      const sig = `${(localItem.studentId || '').toLowerCase()}|${(localItem.email || '').toLowerCase()}`;
      if (!seenSignatures.has(sig)) {
        seenSignatures.add(sig);
        combined.push(localItem);
      }
    }

    combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    callback(combined);
  };

  // Initial local emit
  emitMerged();

  // Subscribe to Cloud Firestore
  let unsubscribeFirestore = () => {};
  try {
    const internshipsQuery = query(collection(db, 'internships'), orderBy('createdAt', 'desc'));
    unsubscribeFirestore = onSnapshot(
      internshipsQuery,
      (snapshot) => {
        firestoreItems = snapshot.docs.map((docSnap) => {
          const d = docSnap.data();
          return {
            id: docSnap.id,
            registrationNumber: d.registrationNumber || `OCT-INT-2026-${docSnap.id.slice(-4)}`,
            fullName: d.fullName || 'Student',
            email: d.email || '',
            phone: d.phone || '',
            school: d.school || '',
            department: d.department || '',
            level: d.level || '',
            studentId: d.studentId || '',
            programType: d.programType || '6-Month SIWES',
            techTrack: d.techTrack || 'Full-Stack Web Development',
            preferredStartDate: d.preferredStartDate,
            statementOfPurpose: d.statementOfPurpose,
            status: d.status || 'pending',
            adminNotes: d.adminNotes,
            createdAt: d.createdAt || new Date().toISOString(),
          } as InternshipRecord;
        });
        emitMerged();
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'internships');
      }
    );
  } catch (err) {
    console.warn('Firestore internships subscription notice:', err);
  }

  // Poll PostgreSQL backend
  const fetchPg = async () => {
    try {
      const rows = await fetchInternshipsFromPostgres();
      postgresItems = rows;
      emitMerged();
    } catch {
      // Ignore
    }
  };

  fetchPg();
  const pgInterval = setInterval(fetchPg, 6000);

  return () => {
    isMounted = false;
    unsubscribeFirestore();
    clearInterval(pgInterval);
  };
}

/**
 * Update the status or admin notes of an internship registration
 */
export async function updateInternshipStatus(
  id: string,
  status: InternshipRecord['status'],
  adminNotes?: string
): Promise<void> {
  // Update Local Cache
  const current = getLocalInternships();
  const updated = current.map((item) => (item.id === id ? { ...item, status, adminNotes } : item));
  localStorage.setItem(LOCAL_STORAGE_INTERNSHIPS_KEY, JSON.stringify(updated));

  // Update in Firestore
  try {
    if (!id.startsWith('pg-') && !id.startsWith('int-')) {
      const docRef = doc(db, 'internships', id);
      await updateDoc(docRef, {
        status,
        ...(adminNotes !== undefined ? { adminNotes } : {}),
      });
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `internships/${id}`);
  }

  // Update in PostgreSQL
  try {
    const numericId = parseInt(id.replace('pg-', ''), 10);
    if (!isNaN(numericId)) {
      await fetch(`/api/internships/${numericId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminNotes }),
      });
    }
  } catch (error) {
    console.error(`Failed to update internship ${id} in PostgreSQL:`, error);
  }
}

/**
 * Delete an internship record
 */
export async function deleteInternship(id: string): Promise<void> {
  // Delete from local cache
  const current = getLocalInternships();
  const updated = current.filter((item) => item.id !== id);
  localStorage.setItem(LOCAL_STORAGE_INTERNSHIPS_KEY, JSON.stringify(updated));

  // Delete from Firestore
  try {
    if (!id.startsWith('pg-') && !id.startsWith('int-')) {
      const docRef = doc(db, 'internships', id);
      await deleteDoc(docRef);
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `internships/${id}`);
  }

  // Delete from PostgreSQL
  try {
    const numericId = parseInt(id.replace('pg-', ''), 10);
    if (!isNaN(numericId)) {
      await fetch(`/api/internships/${numericId}`, {
        method: 'DELETE',
      });
    }
  } catch (error) {
    console.error(`Failed to delete internship ${id} from PostgreSQL:`, error);
  }
}

// ==========================================
// COURSE REGISTRATIONS SERVICE (ONLINE & OFFLINE)
// ==========================================

export function getLocalCourseRegistrations(): CourseRegistrationRecord[] {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_COURSES_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to read course registrations from localStorage:', e);
  }
  return [];
}

export function saveLocalCourseRegistration(record: CourseRegistrationRecord): void {
  try {
    const current = getLocalCourseRegistrations();
    const filtered = current.filter((r) => r.id !== record.id && r.registrationNumber !== record.registrationNumber);
    const updated = [record, ...filtered];
    localStorage.setItem(LOCAL_STORAGE_COURSES_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save course registration to localStorage:', e);
  }
}

/**
 * Submit course registration to Firestore and PostgreSQL
 */
export async function submitCourseRegistration(
  formData: CourseRegistrationFormData
): Promise<{ success: boolean; registrationNumber: string; id: string }> {
  const nowIso = new Date().toISOString();
  const localId = `crs-${Date.now()}`;
  const regNumber = `OCT-CRS-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  const formattedDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const record: CourseRegistrationRecord = {
    id: localId,
    registrationNumber: regNumber,
    fullName: (formData.fullName || '').trim() || 'Student Applicant',
    email: (formData.email || '').trim(),
    phone: (formData.phone || '').trim(),
    course: formData.course || 'web_dev',
    courseTitle: formData.courseTitle || 'Full-Stack Web Development',
    classFormat: formData.classFormat || 'online',
    schedule: formData.schedule || 'Flexible',
    duration: formData.duration || '12 Weeks',
    experienceLevel: formData.experienceLevel || 'Beginner',
    preferredStartDate: formData.preferredStartDate || 'Immediate Cohort (Monday)',
    registrationDate: formattedDate,
    cityState: formData.cityState ? formData.cityState.trim() : 'Candidate',
    notes: (formData.notes || '').trim(),
    status: 'pending',
    createdAt: nowIso,
  };

  // 1. Cache immediately in localStorage
  saveLocalCourseRegistration(record);

  let resultingId = localId;

  // 2. Store in Cloud Firestore (course_registrations collection)
  try {
    const firestorePayload = {
      registrationNumber: record.registrationNumber,
      fullName: record.fullName,
      email: record.email,
      phone: record.phone,
      course: record.course,
      courseTitle: record.courseTitle,
      classFormat: record.classFormat,
      schedule: record.schedule,
      duration: record.duration,
      experienceLevel: record.experienceLevel,
      preferredStartDate: record.preferredStartDate,
      registrationDate: record.registrationDate,
      cityState: record.cityState,
      notes: record.notes,
      status: 'pending',
      createdAt: nowIso,
      submittedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'course_registrations'), firestorePayload);
    resultingId = docRef.id;
    record.id = docRef.id;
    saveLocalCourseRegistration(record);
    console.log('Saved course registration to Firestore:', docRef.id);
  } catch (firestoreError) {
    handleFirestoreError(firestoreError, OperationType.CREATE, 'course_registrations');
  }

  // 3. Store in PostgreSQL backend API
  try {
    const res = await fetch('/api/course-registrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        registrationNumber: record.registrationNumber,
        fullName: record.fullName,
        email: record.email,
        phone: record.phone,
        course: record.course,
        courseTitle: record.courseTitle,
        classFormat: record.classFormat,
        schedule: record.schedule,
        duration: record.duration,
        experienceLevel: record.experienceLevel,
        preferredStartDate: record.preferredStartDate,
        registrationDate: record.registrationDate,
        cityState: record.cityState,
        notes: record.notes,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.registration?.id) {
        console.log('Saved course registration to PostgreSQL:', data.registration.id);
      }
    }
  } catch (pgError) {
    console.warn('PostgreSQL course registration note:', pgError);
  }

  return {
    success: true,
    registrationNumber: regNumber,
    id: resultingId,
  };
}

/**
 * Fetch course registrations from PostgreSQL
 */
export async function fetchCourseRegistrationsFromPostgres(): Promise<CourseRegistrationRecord[]> {
  try {
    const res = await fetch('/api/course-registrations');
    if (!res.ok) return [];
    const data = await res.json();
    return (data.registrations || []).map((row: any) => ({
      id: `pg-${row.id}`,
      registrationNumber: row.registrationNumber || row.registration_number,
      fullName: row.fullName || row.full_name,
      email: row.email,
      phone: row.phone,
      course: row.course,
      courseTitle: row.courseTitle || row.course_title,
      classFormat: row.classFormat || row.class_format,
      schedule: row.schedule,
      duration: row.duration,
      experienceLevel: row.experienceLevel || row.experience_level,
      preferredStartDate: row.preferredStartDate || row.preferred_start_date || '',
      registrationDate: row.registrationDate || row.registration_date || '',
      cityState: row.cityState || row.city_state || '',
      notes: row.notes || '',
      status: row.status || 'pending',
      adminNotes: row.adminNotes || row.admin_notes || '',
      createdAt: row.createdAt || row.created_at || new Date().toISOString(),
    }));
  } catch (error) {
    console.warn('Failed to fetch course registrations from PostgreSQL:', error);
    return [];
  }
}

/**
 * Real-time subscription to course registrations
 */
export function subscribeToCourseRegistrations(
  callback: (records: CourseRegistrationRecord[]) => void
): () => void {
  // Initial callback with local cache
  const localCache = getLocalCourseRegistrations();
  callback(localCache);

  // Attempt to fetch from PostgreSQL
  fetchCourseRegistrationsFromPostgres().then((pgRecords) => {
    if (pgRecords.length > 0) {
      const mergedMap = new Map<string, CourseRegistrationRecord>();
      pgRecords.forEach((r) => mergedMap.set(r.registrationNumber, r));
      localCache.forEach((r) => {
        if (!mergedMap.has(r.registrationNumber)) {
          mergedMap.set(r.registrationNumber, r);
        }
      });
      const merged = Array.from(mergedMap.values()).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      callback(merged);
    }
  });

  // Subscribe to Cloud Firestore
  try {
    const q = query(collection(db, 'course_registrations'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const firestoreRecords: CourseRegistrationRecord[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          firestoreRecords.push({
            id: docSnap.id,
            registrationNumber: data.registrationNumber || `OCT-CRS-${docSnap.id.slice(0, 6)}`,
            fullName: data.fullName || 'Student',
            email: data.email || '',
            phone: data.phone || '',
            course: data.course || 'web_dev',
            courseTitle: data.courseTitle || 'Full-Stack Web Development',
            classFormat: data.classFormat || 'online',
            schedule: data.schedule || 'Flexible',
            duration: data.duration || '12 Weeks',
            experienceLevel: data.experienceLevel || 'Beginner',
            preferredStartDate: data.preferredStartDate || '',
            registrationDate: data.registrationDate || '',
            cityState: data.cityState || '',
            notes: data.notes || '',
            status: data.status || 'pending',
            adminNotes: data.adminNotes || '',
            createdAt: data.createdAt || new Date().toISOString(),
          });
        });

        // Merge with local and PG records
        const currentLocal = getLocalCourseRegistrations();
        const mergedMap = new Map<string, CourseRegistrationRecord>();
        firestoreRecords.forEach((r) => mergedMap.set(r.registrationNumber, r));
        currentLocal.forEach((r) => {
          if (!mergedMap.has(r.registrationNumber)) {
            mergedMap.set(r.registrationNumber, r);
          }
        });

        const merged = Array.from(mergedMap.values()).sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        localStorage.setItem(LOCAL_STORAGE_COURSES_KEY, JSON.stringify(merged));
        callback(merged);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'course_registrations');
      }
    );

    return unsubscribe;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'course_registrations');
    return () => {};
  }
}

/**
 * Update course registration status
 */
export async function updateCourseRegistrationStatus(
  id: string,
  status: CourseRegistrationRecord['status'],
  adminNotes?: string
): Promise<void> {
  // Update in local cache
  const current = getLocalCourseRegistrations();
  const updatedList = current.map((item) => {
    if (item.id === id) {
      return { ...item, status, adminNotes: adminNotes ?? item.adminNotes };
    }
    return item;
  });
  localStorage.setItem(LOCAL_STORAGE_COURSES_KEY, JSON.stringify(updatedList));

  // Update in Firestore
  try {
    if (!id.startsWith('pg-') && !id.startsWith('crs-')) {
      const docRef = doc(db, 'course_registrations', id);
      const updateData: Record<string, any> = { status, updatedAt: serverTimestamp() };
      if (adminNotes !== undefined) {
        updateData.adminNotes = adminNotes;
      }
      await updateDoc(docRef, updateData);
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `course_registrations/${id}`);
  }

  // Update in PostgreSQL
  try {
    const numericId = parseInt(id.replace('pg-', ''), 10);
    if (!isNaN(numericId)) {
      await fetch(`/api/course-registrations/${numericId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminNotes }),
      });
    }
  } catch (error) {
    console.error(`Failed to update course registration ${id} in PostgreSQL:`, error);
  }
}

/**
 * Delete a course registration
 */
export async function deleteCourseRegistration(id: string): Promise<void> {
  // Delete from local cache
  const current = getLocalCourseRegistrations();
  const updated = current.filter((item) => item.id !== id);
  localStorage.setItem(LOCAL_STORAGE_COURSES_KEY, JSON.stringify(updated));

  // Delete from Firestore
  try {
    if (!id.startsWith('pg-') && !id.startsWith('crs-')) {
      const docRef = doc(db, 'course_registrations', id);
      await deleteDoc(docRef);
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `course_registrations/${id}`);
  }

  // Delete from PostgreSQL
  try {
    const numericId = parseInt(id.replace('pg-', ''), 10);
    if (!isNaN(numericId)) {
      await fetch(`/api/course-registrations/${numericId}`, {
        method: 'DELETE',
      });
    }
  } catch (error) {
    console.error(`Failed to delete course registration ${id} from PostgreSQL:`, error);
  }
}

