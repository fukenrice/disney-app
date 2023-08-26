import {auth, db, doc, setDoc, getDoc} from "../firebase/config"
import ListModel from "../models/ListModel";
import CommentModel from "../models/CommentModel";

const getCloudData = async () => {
    try {
        const docRef = doc(db, "users", auth.currentUser?.uid!)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
            return docSnap.data()
        } else {
            console.log("No such document!")
        }
    } catch (e) {
        console.log(e)
    }
}

const storeCloudData = async (value: {comments: CommentModel[], lists: ListModel[]}) => {
    try {
        const docref = await setDoc(doc(db, "users", auth.currentUser?.uid!), value)
    } catch (e) {
        console.log(e)
    }
}

export {storeCloudData, getCloudData}