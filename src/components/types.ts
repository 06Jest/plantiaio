export type NoteWithActions = {
  id: string;
  originalContent: string;
  currentContent: string;
  createdAt: string;
  updatedAt: string;
  updateAction: (formData: FormData) => void | Promise<void>;
  deleteAction: (formData: FormData) => void | Promise<void>;
  publishAction: (formData: FormData) => void | Promise<void>;
};