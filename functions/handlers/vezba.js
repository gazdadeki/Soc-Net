
exports.likeScream = (req, res) => {

    const likeDocument = db
        .collection('likes')
        .where('userHandle', '==', req.user.handle)
        .where('screamId', '==', req.params.screamId)
        .limit(1);

    const screamDocument = db
        .doc(`/screams/${req.params.screamId}`);

    screamData = {};

    screamDocument.get()
        .then((doc) => {
            if (doc.exists) {
                screamData = doc.data();
                screamData.screamId = doc.id;
                likeDocument.get();
            }
            else {
                return res.status(404).json({ error: 'Scream not found' })
            }
        })
        .then((data) => {
            if (data.empty) {
                return db
                    .collection('likes').add({
                        userHandle: req.user.handle,
                        screamId: req.params.screamId
                    })
                    .then(() => {
                        screamData.likeCount++
                        return screamData.update({ likeCount: screamData.likeCount });
                    })
                    .then(() => {
                        return res.json(screamData)
                    })
            }
            else {
                return res.status(400).json({ error: 'Scream allready liked' })
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: err.code });
        })
}



exports.unlikeScream = (req, res) => {
    const likeDocument = db
        .collection('/likes')
        .where('userHandle', '==', req.user.handle)
        .where('screamId', '==', req.params.screamId)
        .limit(1);

    const screamDocument = db.doc(`/screams/${req.params.screamId}`);

    let screamData = {}
    //const screamData; svejedno naknadno sa doc.data() mu dodelimo tip objekta

    screamDocument.get()
        .then((doc) => {
            if (doc.exists) {
                screamData = doc.data();
                screamData.screamId = doc.id
                return likeDocument.get()
            } else {
                return res.status(404).json({ error: 'Scream not found' })
            }
        })
        .then((data) => {
            if (data.empty) {
                return res.status(404).json({ error: 'Scream not liked' })
            } else {
                db.doc(`/likes/${data.docs[0].id}`).delete()
                    .then(() => {
                        screamData.likeCount--;
                        return screamDocument.update({ likeCount: screamData.likeCount })
                    })
                    .then(() => {
                        return res.json(screamData)
                    })
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: err.code })
        })

}

exports.deleteScream = (req, res) => {
    const documentDelete = db.doc(`/screams/${req.params.screamId}`)

    documentDelete.get()
        .then((doc) => {
            if (!doc.exists) {
                return res.status(404).json({ error: 'Scream not found' })
            }
            if (doc.data().userHandle !== req.user.handle) {
                return res.status(403).json({ error: 'Unauthorized' })
            }
            else {
                return documentDelete.delete()
            }
        })
        .then(() => {
            return res.status(201).json({ message: 'Scream deleted sucessfully' })
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: err.code })
        })
}

exports.createNotificationOnLike = functions
    .region('europe-west1')
    .firestore.document('/likes/{id}')
    .onCreate((snapshot) => {
        return db.doc(`/screams/${snapshot.data().screamId}`)
            .get()
            .then((doc) => {
                return db.doc(`/notifications/${snapshot.id}`).set({
                    createdAt: new Date().toISOString(),
                    recipient: doc.data().userHandle,
                    sender: snapshot.data().userHandle,
                    type: 'like',
                    read: false,
                    screamdId: doc.id
                })
            })
            .then(() => {
                return;
            })
            .catch((err) => {
                console.error(err)
                return;
            })
    })

exports.deleteNotificationOnUnlike = functions
    .region('europe-west1')
    .firestore.document('/likes/{id}')
    .onDelete((snapshot) => {
        return db.doc(`/notifications/${snapshot.id}`)
            .delete()
            .then(() => {
                return;
            })
            .catch((err) => {
                console.error(err);
                return;
            })

    })

exports.createNotificationOnComment = functions
    .region('europe-west1')
    .firestore.document('/comments/{id}')
    .onCreate((snapshot) => {
        return db.doc(`/screams/${snapshot.data().screamId}`)
            .get()
            .then((doc) => {
                return db.doc(`/notifications/${snapshot.id}`).set({
                    createdAt: new Date().toISOString(),
                    recipient: doc.data().userHandle,
                    sender: snapshot.data().userHandle,
                    type: 'comment',
                    read: false,
                    screamdId: doc.id
                })
            })
            .catch((err) => {
                console.error(err)

            })
    })

exports.createNotificationOnLike = functions
    .region('europe-west1')
    .firestore.document('/likes/{id}')
    .onCreate((snapshot) => {
        return db.doc(`/screams/${snapshot.data().screamId}`)
            .then((doc) => {
                if (doc.exists && doc.data().userHandle !== snapshot.data().userHandle) {
                    return db.doc(`/notifications/${snapshot.id}`).set({
                        createdAt: new Date().toISOString(),
                        recipient: doc.data().userHandle,
                        sender: snapshot.data().userHandle,
                        type: 'like',
                        screamId: doc.id,
                        read: false
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            })
    })


exports.createNotificationOnComment = functions
    .region('europe-west1')
    .firestore.document('/comments/{id}')
    .onCreate((snapshot) => {
        return db.doc(`/screams/${snapshot.data().screamId}`)
            .then((doc) => {
                if (doc.exists && doc.data().userHandle !== snapshot.data().userHandle) {
                    return db.doc(`/notifications/${snapshot.id}`).set({
                        createdAt: new Date().toISOString(),
                        recipient: doc.data().userHandle,
                        sender: snapshot.data().userHandle,
                        type: 'comment',
                        screamId: doc.id,
                        read: false
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            })
    })

exports.deleteNotificationOnUnlike = functions
    .region('europe-west1')
    .firestore.document('/likes/${id}')
    .onDelete((snapshot) => {
        return db.doc(`/notifications/${snapshot.id}`)
            .delete()
            .catch((err) => {
                console.error(err);
                return;
            })
    })





exports.getUserDetails = (req, res) => {
    let userData = {};

    db.doc(`/users/${req.params.handle}`)
        .get()
        .then((doc) => {
            if (doc.exists) {
                userData.user = doc.data()
                return db.collection('screams').where('userHandle', '==', req.params.handle)
                    .orderBy('createdAt', 'desc')
                    .get()
            } else {
                return res.status(404).json({ error: 'This user doesnt exist' })
            }
        })
        .then((data) => {
            userData.screams = []
            data.forEach((doc) => {
                userData.screams.push({
                    body: doc.data().body,
                    userHandle: doc.data().userHandle,
                    createdAt: doc.data().createdAt,
                    likeCount: doc.data().likeCount,
                    commentCount: doc.data().commentCount,
                    userImage: doc.data().userImage,
                    screamId: doc.id

                })
            })
            return res.json(userData)
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code })
        })
}





exports.markNotificationsRead = (req, res) => {
    let batch = db.batch();
    req.body.forEach((notificationId) => {
        notification = db.doc(`/notifications/${notificationId}`);
        batch.update(notification, { read: true });
    });
    batch.commit()
        .then(() => {
            return res.json({ message: 'Notification marked read' })
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: err.code })
        })
}

exports.onScreamDelete = functions
    .region('europe-west1')
    .firestore.document('/screams/{screamId}')
    .onDelete((snapshot, context) => {
        const screamIdRef = context.params.screamId;
        const batch = db.batch();

        return db
            .collection('comments')
            .where('screamId', '==', screamIdRef)
            .get()
            .then((data) => {
                data.forEach((doc) => {
                    batch.delete(db.doc(`/comments/${doc.id}`))
                })
                return db
                    .collection('likes')
                    .where('screamId', '==', screamIdRef)
                    .get()


            })
            .then((data) => {
                data.forEach((doc) => {
                    batch.delete(db.doc(`/likes/${doc.id}`))
                })
                return db
                    .collection('notifications')
                    .where('screamId', '==', screamIdRef)
                    .get()
            })
            .then((data) => {
                data.forEach((doc) => {
                    batch.delete(db.doc(`/notifications/${doc.id}`))
                })
                return batch.commit()
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({ error: 'OOPS Something went wrong' })
            })

    })

exports.onUserImageChange = functions
    .region('europe-west1')
    .firestore.document('/users/{userId}')
    .onUpdate((change) => {
        console.log(change.before.data());
        console.log(change.after.data())

        if (change.before.data().imageUrl !== change.after.data().imageUrl) {
            console.log('image has changed')
            const batch = db.batch()

            return db.collection('screams')
                .where('userHandle', '==', change.before.data().handle)
                .get()
                .then((data) => {
                    data.forEach((doc) => {
                        const screamIdRef = db.doc(`/screams/${doc.id}`);
                        batch.update(screamIdRef, { userImage: change.after.data().imageUrl });
                    });
                    return batch.commit();
                })
        } else {
            return true
        }
    });

exports.onUserImageChange = functions
    .region('europe-west1')
    .firebase.document('/users/{userId}')
    .onUpdate((change) => {
        if (change.before.data().imageUrl !== change.after.data().imageUrl) {
            const batch = db.batch();
            return db
                .collection('screams')
                .where('userHandle', '==', change.before.data().handle)
                .get()
                .then((data) => {
                    data.forEach((doc) => {
                        const screamRef = db.doc(`/screams/${doc.id}`)
                        batch.update(screamRef, { userImage: change.after.data().imageUrl })
                    })
                    return batch.commit();
                })

        } else {
            return true;
        }
    });

exports.onScreamDelete = functions
    .region('europe-west1')
    .firestore.document('/screams/{screamId}')
    .onDelete((snapshot, context) => {
        const screamIdRef = context.params.screamId;
        const batch = db.batch();

        return db
            .collection('comments')
            .where('screamId', '==', screamIdRef)
            .get()
            .then((data) => {
                data.forEach((doc) => {
                    batch.delete(db.doc(`/comments/${doc.id}`))
                })
                return db
                    .collection('likes')
                    .where('screamId', '==', screamIdRef)
                    .get()
            })
            .then((data) => {
                data.forEach((doc) => {
                    batch.delete(db.doc(`/likes/${doc.id}`))
                })
                return db
                    .collection('notifications')
                    .where('screamId', '==', screamIdRef)
                    .get()
            })
            .then((data) => {
                data.forEach((doc) => {
                    batch.delete(db.doc(`/notifications/${doc.id}`))
                })
                return batch.commit();
            })
            .catch((err) => {
                console.log(err);
            })
    });




