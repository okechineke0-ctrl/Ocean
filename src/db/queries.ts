import { db, createPool } from './index.ts';
import { inquiries, emergencyTickets, internships, users } from './schema.ts';
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

export interface CreateInternshipInput {
  registrationNumber?: string;
  fullName: string;
  email: string;
  phone: string;
  school: string;
  department: string;
  level: string;
  studentId: string;
  programType: string;
  techTrack: string;
  preferredStartDate?: string;
  statementOfPurpose?: string;
}

/**
 * Ensures internships table exists in PostgreSQL
 */
export async function ensureInternshipsTable() {
  try {
    const pool = createPool();
    await pool.query(`
      CREATE TABLE IF NOT EXISTS internships (
        id SERIAL PRIMARY KEY,
        registration_number VARCHAR(100) NOT NULL UNIQUE,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(100) NOT NULL,
        school VARCHAR(255) NOT NULL,
        department VARCHAR(255) NOT NULL,
        level VARCHAR(50) NOT NULL,
        student_id VARCHAR(100) NOT NULL,
        program_type VARCHAR(100) NOT NULL,
        tech_track VARCHAR(150) NOT NULL,
        preferred_start_date VARCHAR(100),
        statement_of_purpose TEXT,
        status VARCHAR(50) DEFAULT 'pending' NOT NULL,
        admin_notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `);
  } catch (e) {
    console.warn('PostgreSQL ensureInternshipsTable notice:', e);
  }
}

/**
 * Creates a new student internship / IT & SIWES registration in PostgreSQL
 */
export async function createInternship(input: CreateInternshipInput) {
  try {
    await ensureInternshipsTable();
    const regNumber = input.registrationNumber || `OCT-INT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const inserted = await db
      .insert(internships)
      .values({
        registrationNumber: regNumber,
        fullName: input.fullName,
        email: input.email,
        phone: input.phone,
        school: input.school,
        department: input.department,
        level: input.level,
        studentId: input.studentId,
        programType: input.programType,
        techTrack: input.techTrack,
        preferredStartDate: input.preferredStartDate || null,
        statementOfPurpose: input.statementOfPurpose || null,
        status: 'pending',
      })
      .returning();

    return inserted[0];
  } catch (error) {
    console.error('Failed to create internship in PostgreSQL:', error);
    throw new Error('Failed to record internship registration in PostgreSQL.', { cause: error });
  }
}

/**
 * Fetches recent internship registrations
 */
export async function getInternships(limitCount = 50) {
  try {
    await ensureInternshipsTable();
    return await db
      .select()
      .from(internships)
      .orderBy(desc(internships.createdAt))
      .limit(limitCount);
  } catch (error) {
    console.error('Failed to query internships from PostgreSQL:', error);
    return [];
  }
}

/**
 * Updates status and admin notes of an internship in PostgreSQL
 */
export async function updateInternshipRecord(id: number, status: string, adminNotes?: string) {
  try {
    await ensureInternshipsTable();
    const updatePayload: Record<string, any> = { status, updatedAt: new Date() };
    if (adminNotes !== undefined) {
      updatePayload.adminNotes = adminNotes;
    }
    const updated = await db
      .update(internships)
      .set(updatePayload)
      .where(eq(internships.id, id))
      .returning();
    return updated[0];
  } catch (error) {
    console.error(`Failed to update internship ${id} in PostgreSQL:`, error);
    throw new Error('Failed to update internship.', { cause: error });
  }
}

/**
 * Deletes an internship registration from PostgreSQL
 */
export async function deleteInternshipRecord(id: number) {
  try {
    await ensureInternshipsTable();
    await db.delete(internships).where(eq(internships.id, id));
    return true;
  } catch (error) {
    console.error(`Failed to delete internship ${id} in PostgreSQL:`, error);
    throw new Error('Failed to delete internship.', { cause: error });
  }
}

