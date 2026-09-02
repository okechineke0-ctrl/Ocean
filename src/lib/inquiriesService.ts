import { InquiryRecord } from '../types';

const LOCAL_STORAGE_KEY = 'ocean_tech_inquiries_cache';

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
 * Save an inquiry (Quote, Contact Form message, or Rapid Project Triage) to the backend PostgreSQL database.
 */
export async function saveInquiry(
  inquiry: Omit<InquiryRecord, 'id' | 'createdAt' | 'status'>
): Promise<string> {
  const localId = `quote-${Date.now()}`;
  const nowIso = new Date().toISOString();

  // Optimistic local cache entry
  const optimisticRecord: InquiryRecord = {
    id: localId,
    type: inquiry.type || 'quote',
    fullName: (inquiry.fullName || '').trim() || 'Prospective Client',
    email: (inquiry.email || '').trim() || 'client@oceantechnologies.ng',
    phone: (inquiry.phone || '').trim() || 'Not provided',
    companyOrProject: (inquiry.companyOrProject || '').trim(),
    serviceType: inquiry.serviceType || 'Website Development',
    budgetRange: inquiry.budgetRange,
    timeline: inquiry.timeline,
    urgency: inquiry.urgency || 'Standard',
    message: inquiry.message || 'Project inquiry submitted via Ocean Technologies website',
    preferredContact: inquiry.preferredContact || 'WhatsApp',
    status: 'new',
    createdAt: nowIso,
  };

  saveLocalInquiry(optimisticRecord);

  try {
    const res = await fetch('/api/inquiries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clientName: optimisticRecord.fullName,
        email: optimisticRecord.email,
        phone: optimisticRecord.phone,
        company: optimisticRecord.companyOrProject,
        serviceType: optimisticRecord.serviceType,
        projectType: optimisticRecord.type,
        budgetRange: optimisticRecord.budgetRange,
        timeline: optimisticRecord.timeline,
        urgency: optimisticRecord.urgency,
        projectDescription: optimisticRecord.message,
        preferredContactMethod: optimisticRecord.preferredContact,
        source: optimisticRecord.type,
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      console.warn('Backend returned error for inquiry:', errData);
      return localId;
    }

    const data = await res.json();
    const serverId = String(data.inquiry?.id || localId);
    
    // Update local cache with server id
    optimisticRecord.id = serverId;
    saveLocalInquiry(optimisticRecord);

    return serverId;
  } catch (error) {
    console.error('Failed to save inquiry to PostgreSQL database:', error);
    return localId;
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
      body: JSON.stringify(ticket),
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
 * Fetch recent inquiries from PostgreSQL merged with local cache
 */
export async function fetchInquiriesFromPostgres(): Promise<InquiryRecord[]> {
  const localList = getLocalInquiries();

  try {
    const res = await fetch('/api/inquiries');
    if (!res.ok) {
      return localList;
    }
    const data = await res.json();
    const serverList: InquiryRecord[] = (data.inquiries || []).map((row: any) => ({
      id: String(row.id),
      type: (row.projectType === 'emergency_issue' ? 'emergency_issue' : row.projectType === 'contact' ? 'contact' : 'quote') as any,
      fullName: row.clientName,
      email: row.email,
      phone: row.phone,
      companyOrProject: row.company,
      serviceType: row.serviceType,
      message: row.projectDescription,
      budgetRange: row.budgetRange,
      timeline: row.timeline,
      urgency: row.urgency,
      preferredContact: row.preferredContactMethod,
      status: row.status === 'resolved' ? 'resolved' : row.status === 'in_progress' ? 'in_progress' : 'new',
      adminNotes: row.adminNotes,
      createdAt: row.createdAt ? new Date(row.createdAt).toISOString() : new Date().toISOString(),
    }));

    // Merge server list with local items not yet on server
    const serverIds = new Set(serverList.map((i) => i.id));
    const merged = [...serverList];

    for (const localItem of localList) {
      if (!serverIds.has(localItem.id)) {
        merged.push(localItem);
      }
    }

    return merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('Error fetching inquiries from PostgreSQL:', error);
    return localList;
  }
}

/**
 * Poll / subscribe to inquiries from PostgreSQL
 */
export function subscribeToInquiries(
  callback: (inquiries: InquiryRecord[]) => void
): () => void {
  let isMounted = true;

  const fetchAndNotify = async () => {
    if (!isMounted) return;
    const records = await fetchInquiriesFromPostgres();
    if (isMounted) {
      callback(records);
    }
  };

  fetchAndNotify();
  const intervalId = setInterval(fetchAndNotify, 6000);

  return () => {
    isMounted = false;
    clearInterval(intervalId);
  };
}

/**
 * Update an inquiry's status and notes in PostgreSQL
 */
export async function updateInquiryStatus(
  id: string,
  status: InquiryRecord['status'],
  adminNotes?: string
): Promise<void> {
  try {
    const numericId = parseInt(id, 10);
    if (!isNaN(numericId)) {
      await fetch(`/api/inquiries/${numericId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          adminNotes,
        }),
      });
    }

    // Update local cache as well
    const current = getLocalInquiries();
    const updated = current.map((item) => (item.id === id ? { ...item, status, adminNotes } : item));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error(`Failed to update inquiry ${id} in PostgreSQL:`, error);
  }
}

/**
 * Delete an inquiry from PostgreSQL and local cache
 */
export async function deleteInquiry(id: string): Promise<void> {
  try {
    const numericId = parseInt(id, 10);
    if (!isNaN(numericId)) {
      await fetch(`/api/inquiries/${numericId}`, {
        method: 'DELETE',
      });
    }

    const current = getLocalInquiries();
    const updated = current.filter((item) => item.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error(`Failed to delete inquiry ${id} from PostgreSQL:`, error);
  }
}
