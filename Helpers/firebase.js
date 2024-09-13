const firebase = require("firebase-admin");

const firebaseConfiKeys = {
        // "type": "service_account",
        // "project_id": "p2pcabs-a6f5b",
        // "private_key_id": "c09daf7a896213d0bd49f102b583194ec29cd050",
        // "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEuwIBADANBgkqhkiG9w0BAQEFAASCBKUwggShAgEAAoIBAQCgo2G9a+W8iijB\nIfPqGDcE1ij/O9FHfGqoe4XnNW3boKguNC8WMeDci39CM52xe1MMccHN7etya3Po\nB5bCFcgzGi6cj1yvLGV9UpkyrnogZcftPNn5+5SK3pkZ+9iVsVtCiVuXtRiZqAFZ\nLlfjkyHc2haN2x4TcqN/qZpFNKL8YmusHEOLP8cOuIzCsauByw+CVqddb6ENYR1m\neY+wcVdjRmBqqcpwPSqrOJ7LSdLKs7cLWzvnmSrFCuVDxmRGXHKVfMGHfvgl+r8O\n+Vg5WuoCh/nED/t1SBKCW++72z5tTx5cshE3/0jK3X6/BLWWYHGF3sb9l52oOiTU\nsyc7JbcRAgMBAAECgf9fdLb/+L3r662MFsD6uqj3FswF32XdNPGsbLqFShqeCDno\nOtpANiOI6twUWte6P656Fp8z382pkHCv0NKlQoxU0ZohLo/FCHzGm+6tT0EDP3gu\nYZqmEfmTC/OunRl22o2AXF8xJ0wXAt7KP9+6PBRDSNVeNncI13aQxhgGR+ESV/gq\no3q7wJIro+O4bUlOyo3eiapGJNNqDXdcyyKvlcD+rFZ201W5yFFUzmP44q8DaJpW\nGeFkb76eykb4GJRB64392oh8O7rYA9TdGLtJCLHZ+fMzQWDJGKMRIYZ166F7OBMp\nNWSVDbFNuO+23lucLEviLyWvf3TvY/2ieBBYFUkCgYEA2v9GHkj5pv1q2uPZN6Dp\ngpR7n/twcrdwoDC3c06uFpNsh6E/SMoQZeRo86wx+Uj7Z5BisHq0c15uiOeDWRlo\nKG9yp0Ob32MSpCFt2LuVcmmQrWVp2M368gb9QkkhbGBOB/XyKhpoJF7iQdMVfllq\n4ah49+GuILIw0iwVkK/5pakCgYEAu8fKVJfrKT4skYATITxBEqdxX6CVNIxqRj2G\nX7rKt4b7J3ApbLzn6Pnty+OE+JlVq2nMov758ScGjSWSr7VDste7Y4dh/5l5y55c\n2YLLLiqpzTrA7ck2HlBtdSEzQDsdLimw4IalnWe0/y8nrenRVAeAQwXKiXwT9xzM\nX4kIFykCgYEAu8iQ0383s10xtygRJoYwNOwlZXUxYuyxAmtDovgghvM66MH3he7e\nSMCmzeslnuBZ0uAX/8P338VlercqBcina6TE53AtxEsrvNl9W47eAxFKIaUIMgPN\n3qLnn2Md6dRalLDsSfYCvs0trcvWblU2NPFFaSh3K0ogWte6VirPIqECgYBML+15\nkQHKg/1VM1+PloDYbrNjFyYyYd4kjYXdhU4GVG/GOo20HpkBP5YpqTAkJSJLH+v1\nHfqOy0SvM9VmEOdcwoa3BRDPwZdW8/O8FIMXQhwOto3cbEzW0871PPksUE+wkR3A\nmyDK0m7vMlSpDTrvGvQBPXJFgeAf3MFW6aQssQKBgHk5tdP5A4jNSLiiPmUD3H0G\nxeuHBpYmgAnSRMrDeHQlEGOtrO04VmZDaXUBolF3emyx04cnqNAKWVHMVXMiE/Hw\n1V1HnwHOTzyjAnTbmdboTx3u35C+UCwgBoFI4y+r4O1RH5ccT3UIimQQ/+/InkwL\nNNO77mEJ7IjQ85vvvags\n-----END PRIVATE KEY-----\n",
        // "client_email": "firebase-adminsdk-s2l4i@p2pcabs-a6f5b.iam.gserviceaccount.com",
        // "client_id": "111564581271505626525",
        // "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        // "token_uri": "https://oauth2.googleapis.com/token",
        // "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        // "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-s2l4i%40p2pcabs-a6f5b.iam.gserviceaccount.com",
        // "universe_domain": "googleapis.com"
}

firebase.initializeApp({
    credential : firebase.credential.cert(firebaseConfiKeys)
});


module.exports = firebase;