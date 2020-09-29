const controller = {}
const helper = require('../helper/helper')

controller.signup = async (req, res) => {
    try {
        data = await helper.signup(req.body)
        res.json({
            success: true,
            data: data
        })
        
    } catch (error) {
        res.json({
            success: false,
            error : error
        })
    }
}

controller.login = async (req, res) => {
    try {
        const data = await helper.login(req.body)
        
        res.json({
            sucess : true,
            data : data
        })
        
    } catch (error) {
        res.json({
            sucess : false,
            error : error
        })
    }
}
module.exports = controller