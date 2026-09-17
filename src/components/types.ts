export type NoteWithActions = {
  id: string;
  originalContent: string;
  currentContent: string;
  createdAt: string;
  updatedAt: string;
  aiAnalysis: string | null;
  updateAction: (formData: FormData) => void | Promise<void>;
  deleteAction: (formData: FormData) => void | Promise<void>;
  publishAction: (formData: FormData) => void | Promise<void>;
};

export type Plant = {
  id: string;
  name: string;
};