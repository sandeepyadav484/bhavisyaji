const {Firestore} = require('@google-cloud/firestore');
const firestore = new Firestore({
  projectId: 'bhavisyaji1',
  keyFilename: './serviceAccountKey.json'
});

async function test() {
  try {
    const snapshot = await firestore.collection('personas').get();
    snapshot.forEach(doc => {
      console.log(doc.id, '=>', doc.data());
    });
    if (snapshot.empty) {
      console.log('No personas found.');
    }
  } catch (err) {
    console.error('Error reading personas:', err);
  }
}

test(); 