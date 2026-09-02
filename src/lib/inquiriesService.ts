import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from './firebase';
import { InquiryRecord } from '../types';

const INQUIRIES_COLLECTION = 'inquiries';

/**
 * Save a new inquiry (Quote, Contact Message, or Emergency Issue Ticket) to Firestore.
 */
export async function saveInquiry(
  inquiry: Omit<InquiryRecord, 'id' | 'createdAt' | 'status'>
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, INQUIRIES_COLLECTION), {
      ...inquiry,
      status: 'new',
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error('Failed to save inquiry to Firestore:', error);
    // Return a fallback ID if offline so the UI never blocks the user
    return `local-${Date.now()}`;
  }
}

/**
 * Subscribe to live real-time inquiries updates in Firestore.
 */
export function subscribeToInquiries(
  callback: (inquiries: InquiryRecord[]) => void
): () => void {
  try {
    const q = query(
      collection(db, INQUIRIES_COLLECTION),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const records: InquiryRecord[] = [];
        snapshot.forEach((d) => {
          records.push({
            id: d.id,
            ...(d.data() as Omit<InquiryRecord, 'id'>)
          });
        });
        callback(records);
      },
      (error) => {
        console.error('Error listening to inquiries:', error);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error('Failed to set up real-time listener:', error);
    return () => {};
  }
}

/**
 * Update an inquiry's status and admin notes.
 */
export async function updateInquiryStatus(
  id: string,
  status: InquiryRecord['status'],
  adminNotes?: string
): Promise<void> {
  try {
    const docRef = doc(db, INQUIRIES_COLLECTION, id);
    const updateData: Record<string, any> = { status };
    if (adminNotes !== undefined) {
      updateData.adminNotes = adminNotes;
    }
    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error(`Failed to update inquiry ${id}:`, error);
  }
}

/**
 * Delete an inquiry from Firestore.
 */
export async function deleteInquiry(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, INQUIRIES_COLLECTION, id));
  } catch (error) {
    console.error(`Failed to delete inquiry ${id}:`, error);
  }
}
