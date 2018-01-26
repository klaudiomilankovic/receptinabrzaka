"use strict";

(function() {

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCJItlQ5Qo82r_0Z2XOObgKRHw4Sp4RnnQ",
    authDomain: "recepti-na-brzaka.firebaseapp.com",
    databaseURL: "https://recepti-na-brzaka.firebaseio.com",
    projectId: "recepti-na-brzaka",
    storageBucket: "",
    messagingSenderId: "839646076886"
  };
  firebase.initializeApp(config);

  var database = firebase.database();


  var recepti = document.querySelector('#recepti');

  var dbData = firebase.database().ref().once('value').then(function(snapshot) {
     let dbObject = snapshot.val();
  });

  var dbRef = database.ref();

  var recept = {
    ime : 'imetest',
    sastojci : ['sastojak1','sastojak2'],
    priprema : 'priprematest',
    masnoca : 'niska'
  }

  dbRef.push(recept);


}());