'use strict'

const firebase = require('firebase-admin')
const serviceAccount = require('../config/firebase-admin-keys.json')

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: 'https://posts-test-ab70a.firebaseio.com'
})

const db = firebase.firestore()
const auth = firebase.auth()

function deleteCollection (db, collectionPath, batchSize) {
  const collectionRef = db.collection(collectionPath)
  const query = collectionRef.orderBy('__name__').limit(batchSize)

  return new Promise((resolve, reject) => {
    deleteQueryBatch(db, query, batchSize, resolve, reject)
  })
}

function deleteQueryBatch (db, query, batchSize, resolve, reject) {
  query.get()
    .then((snapshot) => {
      // When there are no documents left, we are done
      if (snapshot.size === 0) {
        return 0
      }

      // Delete documents in a batch
      const batch = db.batch()
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref)
      })

      return batch.commit().then(() => {
        return snapshot.size
      })
    }).then((numDeleted) => {
    if (numDeleted === 0) {
      resolve()
      return
    }

    // Recurse on the next process tick, to avoid
    // exploding the stack.
    process.nextTick(() => {
      deleteQueryBatch(db, query, batchSize, resolve, reject)
    })
  })
    .catch(reject)
}

function deleteUsers () {
  auth.listUsers(100)
    .then(function (listUsersResult) {
      const toDelete = []
      listUsersResult.users.forEach(function (userRecord) {
        toDelete.push(auth.deleteUser(userRecord.uid))
        console.log(userRecord.uid)
      })

      Promise.all(toDelete).then(() => {
        console.log('Deleted all users')
        process.exit(0)
      }).catch((error) => {
        console.log('Error deleting users:', error)
      })
    })
    .catch(function (error) {
      console.log('Error listing users:', error)
    })
}

async function cleanDB () {
  await deleteCollection(db, 'users', 10)
  await deleteCollection(db, 'posts', 10)
  await deleteCollection(db, 'comments', 10)
  await deleteCollection(db, 'likes', 10)
  deleteUsers()
}

cleanDB()
