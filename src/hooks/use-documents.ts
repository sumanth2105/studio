
'use client';

import { useMemo } from 'react';
import { collection, query, where } from 'firebase/firestore';
import { useFirebase, useCollection, WithId } from '@/firebase';

export interface Document {
  id: string;
  userId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
}

export function useDocuments(userId?: string) {
  const { firestore } = useFirebase();

  const documentsQuery = useMemo(() => {
    if (!firestore || !userId) return null;
    return query(
      collection(firestore, 'insuranceHolders', userId, 'documents')
    );
  }, [firestore, userId]);

  const { data: documents, isLoading, error } = useCollection<WithId<Document>>(documentsQuery);

  return { documents, isLoading, error };
}

    