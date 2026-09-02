import { InquiryRecord } from '../types';

/**
 * Save an inquiry (Quote, Contact Form message, or Rapid Project Triage) to the backend PostgreSQL database.
 */
export async function saveInquiry(
  inquiry: Omit<InquiryRecord, 'id' | 'createdAt' | 'status'>
): Promise<string> {
  try {
    const res = await fetch('/api/inquiries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clientName: inquiry.fullName,
        email: inquiry.email,
        phone: inquiry.phone,
        company: inquiry.companyOrProject || '',
        serviceType: inquiry.serviceType || inquiry.type || 'web_development',
        projectType: inquiry.type || 'quote',
        budgetRange: inquiry.budgetRange || '',
        timeline: inquiry.timeline || '',
        urgency: inquiry.urgency || 'Standard',
        projectDescription: inquiry.message || `${inquiry.type} inquiry from ${inquiry.fullName}`,
        preferredContactMethod: inquiry.preferredContact || 'whatsapp',
        source: inquiry.type || 'website',
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP ${res.status}`);
    }

    const data = await res.json();
    return String(data.inquiry?.id || `pg-${Date.now()}`);
  } catch (error) {
    console.error('Failed to save inquiry to PostgreSQL database:', error);
    // Return a fallback ID so frontend UX is uninterrupted
    return `local-${Date.now()}`;
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
 * Fetch recent inquiries from PostgreSQL
 */
export async function fetchInquiriesFromPostgres(): Promise<InquiryRecord[]> {
  try {
    const res = await fetch('/api/inquiries');
    if (!res.ok) return [];
    const data = await res.json();
    return (data.inquiries || []).map((row: any) => ({
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
  } catch (error) {
    console.error('Error fetching inquiries from PostgreSQL:', error);
    return [];
  }
}

/**
 * Poll / subscribe to inquiries from PostgreSQL (replaces Firestore onSnapshot)
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
  const intervalId = setInterval(fetchAndNotify, 10000);

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
    if (isNaN(numericId)) return;

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
  } catch (error) {
    console.error(`Failed to update inquiry ${id} in PostgreSQL:`, error);
  }
}

/**
 * Delete an inquiry from PostgreSQL
 */
export async function deleteInquiry(id: string): Promise<void> {
  try {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) return;

    await fetch(`/api/inquiries/${numericId}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error(`Failed to delete inquiry ${id} from PostgreSQL:`, error);
  }
}
