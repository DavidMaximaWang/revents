export const objectToArray = (object)=>{
    if(object){
        return Object.entries(object).map(e=>Object.assign({}, e[1], {}, {id:e[0]}))
    }
}

//user should contain the event itself, hostUid, photo, created, attendees
//will ship thise to firestore
export const createNewEvent = (user, photoURL, event)=>{
    return {
        ...event,
        hostUid: user.uid,
        hostedBy: user.displayName,
        hostPhotoURL: photoURL ||'/assets/user.png',
        created: new Date(),
        attendees: {
            [user.uid]:{
                going: true,
                joinDate: new Date(),
                photoURL: photoURL ||'/assets/user.png',
                displayName: user.displayName,
                host: true
            }
        }
    }
}

export const createDataTree = (dataSet)=>{
    let hashTable = Object.create(null);

    dataSet.forEach((data)=>{
        hashTable[data.id]={...data, childNodes:[]}
    })
    let dataTree = [];
    dataSet.forEach(data=>{
        if(data.parentId){
            hashTable[data.parentId].childNodes.push(hashTable[data.id]);
        }
        else
        dataTree.push(hashTable[data.id])
    })
    return dataTree;
}

