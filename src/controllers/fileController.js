// const FileRepository = require('../repositories/fileRepository.js');
// const firebase = require('firebase/app');
// require('firebase/storage');
// const firebaseConfig = require('../config/firebase/firebase.js')


// firebase.initializeApp(firebaseConfig);

// async function uploadImage(req, res) {
//   try {
//     const file = req.file; // Đây là đối tượng chứa thông tin về file đã được tải lên
//     const imageUrl = await FileRepository.uploadImageToFirebase(file);
//     // Lưu link ảnh vào cơ sở dữ liệu
//     // Ví dụ:
//     // await Database.saveImageUrl(imageUrl);
//     res.status(200).json({ imageUrl });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Failed to upload image' });
//   }
// }

// module.exports = {
//   uploadImage,
// };
