// const firebase = require('firebase/app');
// const firebaseStorage = require('firebase/storage');
// const firebaseConfig = require('../config/firebase/firebase');

// firebase.initializeApp(firebaseConfig.firebaseConfig);
// const storage = firebaseStorage.getStorage();

// async function uploadImageToFirebase(file) {
//     return new Promise((resolve, reject) => {
//         if (!storage) {
//             reject(new Error('Dịch vụ lưu trữ Firebase không khả dụng.'));
//             return;
//         }
//         const storageRef = storage.ref();

//         // Đặt tên cho file trên Firebase (có thể là ngẫu nhiên hoặc theo ý muốn của bạn)
//         const fileName = `${Date.now()}_${file.originalname}`;

//         // Đặt đường dẫn cho file
//         const fileRef = storageRef.child(fileName);

//         // Tải file lên Firebase
//         const uploadTask = fileRef.put(file.buffer);

//         // Lắng nghe sự kiện upload
//         uploadTask.on('state_changed',
//             (snapshot) => {
//                 // Đang upload...
//             },
//             (error) => {
//                 // Xảy ra lỗi trong quá trình upload
//                 reject(error);
//             },
//             () => {
//                 // Upload thành công, lấy link ảnh
//                 uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
//                     resolve(downloadURL);
//                 });
//             }
//         );
//     });
// }

// module.exports = {
//     uploadImageToFirebase,
// };
