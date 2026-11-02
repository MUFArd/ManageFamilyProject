const jwt = require('jsonwebtoken')

const Auth = (req, res, next) => {
    try {
        const token = req.headers.authorization

        if (!token) {
            return res.status(401).json({
                status: 'Gagal',
                message: 'Token tidak di temukan'
            })
        }
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ status: 'Gagal', message: 'Konfigurasi server rusak (Secret Key hilang)' });
        }

        const tokensplit = token.split(' ')[1]
        const data = jwt.verify(
            tokensplit,
            process.env.JWT_SECRET || ''
        )
        req.user = data
        next()
    } catch (error) {
        console.log(error)
        res.status(401).json({
            status: 'Gagal',
            message: 'Token tidak valid'
        })
    }
}

module.exports = Auth