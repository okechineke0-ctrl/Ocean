import { pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

// 1. Users table (linked to Firebase Auth UID if signed in)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  displayName: text('display_name'),
  photoUrl: text('photo_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 2. Inquiries Table (Client Quotes, Maintenance Requests, Contact Form submissions)
export const inquiries = pgTable('inquiries', {
  id: serial('id').primaryKey(),
  clientName: varchar('client_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 100 }).notNull(),
  company: varchar('company', { length: 255 }),
  serviceType: varchar('service_type', { length: 150 }).notNull(), // 'web_development' | 'mobile_app' | 'maintenance' | 'custom_software' | 'consultation'
  projectType: varchar('project_type', { length: 150 }),
  budgetRange: varchar('budget_range', { length: 150 }),
  timeline: varchar('timeline', { length: 150 }),
  urgency: varchar('urgency', { length: 50 }),
  projectDescription: text('project_description').notNull(),
  preferredContactMethod: varchar('preferred_contact_method', { length: 50 }).default('whatsapp'),
  source: varchar('source', { length: 100 }).default('website'), // 'quote_modal' | 'contact_view' | 'rapid_triage' | 'service_page'
  status: varchar('status', { length: 50 }).default('pending').notNull(), // 'pending' | 'in_review' | 'contacted' | 'proposal_sent' | 'closed'
  adminNotes: text('admin_notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 3. Emergency Bug & Incident Tickets Table
export const emergencyTickets = pgTable('emergency_tickets', {
  id: serial('id').primaryKey(),
  ticketNumber: varchar('ticket_number', { length: 100 }).notNull().unique(),
  clientName: varchar('client_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 100 }).notNull(),
  systemUrl: text('system_url'),
  severity: varchar('severity', { length: 50 }).default('critical').notNull(), // 'critical' | 'high' | 'medium'
  errorDescription: text('error_description').notNull(),
  status: varchar('status', { length: 50 }).default('open').notNull(), // 'open' | 'investigating' | 'resolved'
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 4. Internships, Industrial Training (IT) & SIWES Registrations Table
export const internships = pgTable('internships', {
  id: serial('id').primaryKey(),
  registrationNumber: varchar('registration_number', { length: 100 }).notNull().unique(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 100 }).notNull(),
  school: varchar('school', { length: 255 }).notNull(),
  department: varchar('department', { length: 255 }).notNull(),
  level: varchar('level', { length: 50 }).notNull(),
  studentId: varchar('student_id', { length: 100 }).notNull(),
  programType: varchar('program_type', { length: 100 }).notNull(),
  techTrack: varchar('tech_track', { length: 150 }).notNull(),
  preferredStartDate: varchar('preferred_start_date', { length: 100 }),
  statementOfPurpose: text('statement_of_purpose'),
  status: varchar('status', { length: 50 }).default('pending').notNull(),
  adminNotes: text('admin_notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

