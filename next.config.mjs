/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        // domains:["cdn.pixabay.com","www.dropbox.com","www.w3.org","firebasestorage.googleapis.com"],
        remotePatterns:[
            {
                hostname:"cdn.pixabay.com"
            },
            {
                hostname:"www.dropbox.com"
            },
            {
                hostname:"www.w3.org"
            },
            {
                hostname:"firebasestorage.googleapis.com"
            },
            {
            hostname:"readymadeui.com"
            },
            {
                hostname:"images.unsplash.com"
                
            },
            {
                hostname:"i.ibb.co"
                
            },
            {
                hostname:"images.pexels.com"
                
            },{
                hostname:"www.svgrepo.com"
                
            },{
                hostname:"upload.wikimedia.org"
                
            },{
                hostname:"pagedone.io"
                
            }
        ]
    }
};

export default nextConfig;
