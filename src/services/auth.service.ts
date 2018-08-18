import firebase from 'firebase';


export class AuthService {

  
signup(email: string, password: string) {
    
    return firebase.auth().createUserWithEmailAndPassword(email, password)
 }
signIn(email:string,password:string){
return firebase.auth().signInWithEmailAndPassword(email,password);
}
sinout(){
return firebase.auth().signOut();
}
getActiveUser(){
  return firebase.auth().currentUser;
}
updateProfile(displayName,imgUrl){
 const user = firebase.auth().currentUser;
 return user.updateProfile({displayName:displayName,photoURL:imgUrl});
}
updatePhoneNumber(phoneNumber){
  const user =  firebase.auth().currentUser;
  return user.updatePhoneNumber(phoneNumber);
}

}