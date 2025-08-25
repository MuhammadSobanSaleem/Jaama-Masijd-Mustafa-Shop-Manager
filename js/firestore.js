// import { createElement } from 'react';
import {
    db,
    collection,
    addDoc,
    getDocs,
    getDoc,
    doc,
    setDoc,
    deleteDoc
} from './firebase-config.js';


// Functions for storing, editing, getting and removing data in FireStore

let shopAdded;

async function addShop(shopInfo, ownerInfo, duesInfo){

    try{
        const shopNumber = shopInfo.shopNumber

        await setDoc(doc(db, 'shops', shopNumber), {shopInfo, ownerInfo, duesInfo})

        return true;

    }catch(error){
        console.log(error)

        return false;
    }

}

async function getAllData(){
    const allData = []
    const dataSnapshot = await getDocs(collection(db, "shops"))
    
    dataSnapshot.forEach(document => {
        allData.push({id: document.id, ...document.data()});
    });

    return allData
}

async function deleteShop(docId){
    await deleteDoc(doc(db, 'shops', docId))
}

async function getDocument(docId){
    const singleDoc = await getDoc(doc(db, 'shops', docId))
    return singleDoc.data()
}


export{ addShop , getAllData, shopAdded, deleteShop, getDocument}