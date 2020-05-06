import { firestore } from 'firebase'
import { PlainObject, PluginGetAction, GetResponse, DocMetadata } from '@vue-sync/core'
import { FirestoreModuleConfig, FirestorePluginOptions } from '../CreatePlugin'
import { getFirestoreDocPath, getFirestoreCollectionPath } from '../helpers/pathHelpers'
import { isNumber } from 'is-what'

export function getActionFactory (
  firestorePluginOptions: Required<FirestorePluginOptions>
): PluginGetAction {
  return async function (
    payload: PlainObject,
    [collectionPath, docId]: [string, string | undefined],
    firestoreModuleConfig: FirestoreModuleConfig
  ): Promise<GetResponse> {
    const { firestoreInstance } = firestorePluginOptions
    // in case of a doc module
    let snapshots: (firestore.DocumentSnapshot | firestore.QueryDocumentSnapshot)[]
    if (docId) {
      const documentPath = getFirestoreDocPath([collectionPath, docId], firestoreModuleConfig, firestorePluginOptions) // prettier-ignore
      const docSnapshot = await firestoreInstance.doc(documentPath).get()
      snapshots = [docSnapshot]
    }
    // in case of a collection module
    else if (!docId) {
      const _collectionPath = getFirestoreCollectionPath(collectionPath, firestoreModuleConfig, firestorePluginOptions) // prettier-ignore
      const { where = [], orderBy = [], limit } = firestoreModuleConfig
      let query: firestore.CollectionReference | firestore.Query
      query = firestoreInstance.collection(_collectionPath)
      for (const whereClause of where) {
        query = query.where(...whereClause)
      }
      for (const orderByClause of orderBy) {
        query = query.orderBy(...orderByClause)
      }
      if (isNumber(limit)) {
        query = query.limit(limit)
      }
      const querySnapshot = await query.get()
      snapshots = querySnapshot.docs
    }
    // map snapshots to DocMetadata type
    const docs: DocMetadata[] = snapshots.map(snapshot => {
      const docMetaData: DocMetadata = {
        data: (snapshot.data() ?? {}) as any,
        metadata: snapshot as any,
        id: snapshot.id,
        exists: snapshot.exists,
      }
      return docMetaData
    })
    return { docs }
  }
}
