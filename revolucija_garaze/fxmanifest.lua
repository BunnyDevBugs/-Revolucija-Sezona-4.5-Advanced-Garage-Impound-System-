fx_version 'cerulean'
game 'gta5'
lua54 'yes'
version '1.0.0'

files {
    "html/index.html",
    "html/js/script.js",
    "html/config.js",
    "html/css/style.css",
    "html/fonts/*",
    "html/img/*"
}

shared_scripts {
    '@es_extended/imports.lua',
    '@ox_lib/init.lua',
    'config.lua'
}

client_scripts {
    'client/*.lua',
}

server_scripts {
    '@oxmysql/lib/MySQL.lua',
    '@revolucija_admin/server/NisiAdmin.lua',
    'server/*.lua'
}

ui_page "html/index.html"