module.exports = {
    purge: {
        enabled: true,
        content: [
            'app/templates/*.html',
            'app/static/js/*.js'
        ]
    },
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {},
    },
    variants: {
        extend: {},
    },
    plugins: [
        require('@tailwindcss/forms')
    ],
}
