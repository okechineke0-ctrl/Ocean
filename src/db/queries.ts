import { db } from './index.ts';
import { inquiries, emergencyTickets, users } from './schema.ts';
import { desc, eq } from 'drizzle-orm';

export interface CreateInquiryInput {
  clientName: string;
  email: string;
  phone: string;
  company?: string;
  serviceType: string;
  projectType?: string;
  budgetRange?: string;
  timeline?: string;
  urgency?: string;
  projectDescription: string;
  preferredContactMethod?: string;
  source?: string;
}

export interface CreateEmergencyTicketInput {
  clientName: string;
  email: string;
  phone: string;
  systemUrl?: string;
  severity?: string;
  errorDescription: string;
}

/**
 * Creates a new client inquiry in PostgreSQL
 */
export async function createInquiry(input: CreateInquiryInput) {
  try {
    const inserted = await db
      .insert(inquiries)
      .values({
        clientName: input.clientName,
        email: input.email,
        phone: input.phone,
        company: input.company || null,
        serviceType: input.serviceType,
        projectType: input.projectType || null,
        budgetRange: input.budgetRange || null,
        timeline: input.timeline || null,
        urgency: input.urgency || null,
        projectDescription: input.projectDescription,
        preferredContactMethod: input.preferredContactMethod || 'whatsapp',
        source: input.source || 'website',
        status: 'pending',
      })
      .returning();

    return inserted[0];
  } catch (error) {
    console.error('Failed to create inquiry in PostgreSQL:', error);
    throw new Error('Failed to submit your project inquiry. Please try again later.', { cause: error });
  }
}

/**
 * Creates an emergency incident ticket in PostgreSQL
 */
export async function createEmergencyTicket(input: CreateEmergencyTicketInput) {
  try {
    const ticketNumber = `OCT-EMG-${Date.now().toString().slice(-6)}`;
    const inserted = await db
      .insert(emergencyTickets)
      .values({
        ticketNumber,
        clientName: input.clientName,
        email: input.email,
        phone: input.phone,
        systemUrl: input.systemUrl || null,
        severity: input.severity || 'critical',
        errorDescription: input.errorDescription,
        status: 'open',
      })
      .returning();

    return inserted[0];
  } catch (error) {
    console.error('Failed to create emergency ticket in PostgreSQL:', error);
    throw new Error('Failed to record emergency ticket. Please try again later.', { cause: error });
  }
}

/**
 * Fetches recent inquiries
 */
export async function getInquiries(limitCount = 50) {
  try {
    return await db
      .select()
      .from(inquiries)
      .orderBy(desc(inquiries.createdAt))
      .limit(limitCount);
  } catch (error) {
    console.error('Failed to query inquiries from PostgreSQL:', error);
    throw new Error('Failed to fetch inquiries.', { cause: error });
  }
}

/**
 * Updates status and admin notes of an inquiry in PostgreSQL
 */
export async function updateInquiryRecord(id: number, status: string, adminNotes?: string) {
  try {
    const updatePayload: Record<string, any> = { status, updatedAt: new Date() };
    if (adminNotes !== undefined) {
      updatePayload.adminNotes = adminNotes;
    }
    const updated = await db
      .update(inquiries)
      .set(updatePayload)
      .where(eq(inquiries.id, id))
      .returning();
    return updated[0];
  } catch (error) {
    console.error(`Failed to update inquiry ${id} in PostgreSQL:`, error);
    throw new Error('Failed to update inquiry.', { cause: error });
  }
}

/**
 * Deletes an inquiry from PostgreSQL
 */
export async function deleteInquiryRecord(id: number) {
  try {
    await db.delete(inquiries).where(eq(inquiries.id, id));
    return true;
  } catch (error) {
    console.error(`Failed to delete inquiry ${id} in PostgreSQL:`, error);
    throw new Error('Failed to delete inquiry.', { cause: error });
  }
}

/**
 * Fetches recent emergency tickets
 */
export async function getEmergencyTickets(limitCount = 50) {
  try {
    return await db
      .select()
      .from(emergencyTickets)
      .orderBy(desc(emergencyTickets.createdAt))
      .limit(limitCount);
  } catch (error) {
    console.error('Failed to query emergency tickets from PostgreSQL:', error);
    throw new Error('Failed to fetch emergency tickets.', { cause: error });
  }
}
