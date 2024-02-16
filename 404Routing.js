// '/' in src ususaly access root. Ex: 'yourWebSite.com' or 'localhost:port',
// in case of github pages path to your site looks like this 'yourName.github.io/yourRepo'
// that meens that root is 'yourName.github.io'
// and u have to provide your repo name to src like that
// '<script type="module" src="/yourRepo/404Routing.js"></script>'.
// Same for routing fetch.

const curPath = window.location.pathname
const curPage = window.location.pathname.replace('pathtest', '').slice(1)

fetch(`${window.location.origin}/pathtest/route/${curPage}`)
    .then( response => {return response.text()})
    .then( data => {
        document.body.innerHTML = data
        const pathLabel = document.createElement('h2')
        document.body.appendChild(pathLabel)
        pathLabel.textContent = `Path: ${curPath} | Page: ${curPage}`
    })
