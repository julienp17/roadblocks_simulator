const axios = require('axios')

module.exports = {
    async getAllModules(auth) {
        const url = `https://intra.epitech.eu/${process.env.AUTOLOGIN}/course/filter?format=json`

        try {
            const res = await axios.get(url);
            if (res.status != 200) {
                console.error(res)
                return null
            }
            return res.data
        } catch (err) {
            console.error(err)
            return null
        }
    }
}