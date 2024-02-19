// '/' in src ususaly access root. Ex: 'yourWebSite.com' or 'localhost:port',
// in case of github pages path to your site looks like this 'yourName.github.io/yourRepo'
// that meens that root is 'yourName.github.io'
// and u have to provide your repo name to src like that
// '<script type="module" src="/yourRepo/404Routing.js"></script>'.
// Same for routing fetch.

const curPage = window.location.pathname
const curGitPage = window.location.pathname.replace('pathtest', '').slice(1)
const contentBaseNode = document.querySelector('content').cloneNode(true)
const pageFetchingError = new Event('pageFetchingError') 
const onPageChanged = new CustomEvent('onPageChanged', {"detail": {'page': null}})
window.addEventListener('popstate', e => {
    document.querySelector('content').replaceWith(contentBaseNode.cloneNode(true))
    fetchPage(e.state)
})

class RouteElement extends HTMLAnchorElement {
    constructor(){
        super();
        this.onclick = e => {
            e.preventDefault()
            const page = this.getAttribute('href')
            
            if (page === window.location.pathname) return
            history.pushState('/pathtest' + page, null, '/pathtest' + page)
            document.querySelector('content').replaceWith(contentBaseNode.cloneNode(true))
            fetchPage(curGitPage)
        }   
    }
}
customElements.define('route-to', RouteElement, {extends: 'a'})

const fetchPage = (page) => {
    const contentElement = document.querySelector('content')
    onPageChanged.detail.page = page

    if (page === '/' || !page) page = contentElement.getAttribute('startWith')
    fetch(`${window.location.origin}/pathtest/route/${page}.html`)
    .then( response => {return response.text()})
    .then( data => {
            console.log(data, page);
            
            document.title = page.slice(1)
            if(data.startsWith('<!DOCTYPE html>')){
                // const parser = new DOMParser()
                contentElement.replaceWith(contentBaseNode.cloneNode(true))
                document.dispatchEvent(pageFetchingError)
            }else{
                contentElement.innerHTML = data      
                document.dispatchEvent(onPageChanged)
            }
        })
}

fetchPage(curGitPage)
