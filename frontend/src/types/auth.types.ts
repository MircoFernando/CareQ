export type UserRole = 'admin' | 'nurse' | 'doctor';

export interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export interface StaffProfile {
  id: string;
  firebaseUid: string;
  name: string;
  email: string;
  role: UserRole;
  departmentId: string | null;
  departmentName?: string | null;
  hospitalId: string;
  isActive: boolean;
}
