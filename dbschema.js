
//how our data is gonna look like just like a reference thing
let db = {

}

let db = {
    users: [
        {
            userId: 'vivZpIvgJKaLJWkbAJcuCbi8Tvv1',
            email: 'user@email.com',
            handle: 'user',
            createdAt: '2019-12-10T16:41:22.188Z',
            imageUrl: 'https://firebasestorage.googleapis.com/v0/b/soc-net-ad908.appspot.com/o/no-img.png?alt=media',
            bio: 'Hello, my name is user, nice to meet you',
            website: 'https://user.com',
            location: 'London, UK'
        }
    ],
    screams: [
        {
            userHandle: 'user',
            body: 'this is the scream body',
            createdAt: '2019-12-10T14:45:13.514Z',
            likeCount: 5,
            commentCount: 2
        }
    ],
    comments: [
        {
            userHandle: 'user',
            screamId: 'dlfdjkafdakfhakd',
            body: 'nice one mate!',
            createdAt: '2019-12-19T19:22:52.888Z'
        }
    ],
    notifications: [
        {
            recipient: 'user',
            sender: 'firminjo',
            read: 'true | false',
            screamId: 'SDMRtCESWy1EZgkPkgeh',
            type: 'like | comment',
            createdAt: '2019-12-23T16:41:09.696Z'
        }
    ]
}

const userDetails = {
    credentials: {
        userId: 'vivZpIvgJKaLJWkbAJcuCbi8Tvv1',
        email: 'user@email.com',
        handle: 'user',
        createdAt: '2019-12-10T16:41:22.188Z',
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/soc-net-ad908.appspot.com/o/no-img.png?alt=media',
        bio: 'Hello , my name is user, nice to meet you',
        website: 'https://user.com',
        location: 'London, UK'

    },
    likes: [
        {
            userHandle: 'user',
            screamId: 'hh705oWfWucVzGbHH2pa'
        },

        {
            userHandle: 'user',
            screamId: '3IOnFoQexRcofs5OhBXO'
        }
    ]
}
