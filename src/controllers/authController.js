const authRepository = require('../repositories/authRepository');

exports.signUp = async (req, res) => {
  try {
    const newFamily = await authRepository.signUp(req.body);
    return res.json(newFamily);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.verifyCode = async (req, res) => {
  try {
    const verifyCode = await authRepository.VerifyCodeEmail(req.body);
    return res.json(verifyCode)
  } catch (error) {
    console.log('error', error);
    return res.status(500).json({ error: error.message });
  }
}

exports.createNewUser = async (req, res) => {
  try {
    const createNewUser = await authRepository.createNewUser(req.body)
    return res.json(createNewUser)
  } catch  (error){
    return res.status(500).json({ error: error.message });
  }
}

exports.SignInFamily = async(req, res) =>{
  try{
    const SignInFamily = await authRepository.SignInFamily(req.body);
    return res.json(SignInFamily)
  }catch (error){
    return res.status(500).json({ error: error.message });
  }
}
exports.SignInRoleUser = async(req, res) =>{
  try{
    const SignInRoleUser = await authRepository.SignInRoleUser(req.body);
    return res.json(SignInRoleUser)
  }catch (error){
    return res.status(500).json({ error: error.message });
  }
}

