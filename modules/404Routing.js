// '/' in src ususaly access root. Ex: 'yourWebSite.com' or 'localhost:port',
// in case of github pages path to your site looks like this 'yourName.github.io/yourRepo'
// that meens that root is 'yourName.github.io'
// and u have to provide your repo name to src like that
// '<script type="module" src="/yourRepo/404Routing.js"></script>'.
// Same for routing fetch.

// CONTENT TAG HAS 3 ATTRIBUTES
// - startWith="/home"  [page that website starts from]
// - prefix="/customPath"   [in case site origin starts from path ex: yourSite.com/customPath]
// - fileExt=".html">   [some servers requires file endings for fetch ex: local server requires '.html']

//FIX ALL LINKS EVEN BEFORE VAR INITS
fixLinks(document)

// PROPS
const sitePrefix = document.querySelector('content').getAttribute('prefix') || ''
const fileExt = document.querySelector('content').getAttribute('fileExt') || ''
const curPage = window.location.pathname.replace(sitePrefix, '')
const contentBaseNode = document.querySelector('content').cloneNode(true)

//EVENTS
const pageFetchingError = new Event('pageFetchingError') 
const onPageChanged = new CustomEvent('onPageChanged', {"detail": {'page': null}})
window.addEventListener('popstate', e => {
    document.querySelector('content').replaceWith(contentBaseNode.cloneNode(true))
    fetchPage(e.state)
})

//ROUTING LINKS
const doRoute = (el) => {
    el.onclick = e => {
        e.preventDefault()
        const page = el.getAttribute('href')
        
        if (page === window.location.pathname) return
        history.pushState(page, null, sitePrefix + page)
        document.querySelector('content').replaceWith(contentBaseNode.cloneNode(true))
        fetchPage(page)
    }   
}

class RouteElement extends HTMLAnchorElement {
    constructor(){
        super()
        doRoute(this)
    }
}

class RouteElementEx extends HTMLElement {
    constructor(){
        super()
        if (this.hasAttribute('href')) {
            this.style.cursor = 'pointer'
            doRoute(this) 
        }
    }
}

customElements.define('a-route-to', RouteElement, {extends: 'a'})
customElements.define('route-to', RouteElementEx)

//FETCHING
const fetchPage = (page) => {
    const contentElement = document.querySelector('content')
    
    if (!page) page = '/'
    onPageChanged.detail.page = page
    if (page === '/') page = contentElement.getAttribute('startWith')

    fetch(`${window.location.origin}${sitePrefix}/route/${page}${fileExt}`)
    .then( response => {return response.text()})
    .then( data => {
            
            document.title = page.slice(1)
            if(data.startsWith('<!DOCTYPE html>')){
                contentElement.replaceWith(contentBaseNode.cloneNode(true))
                document.dispatchEvent(pageFetchingError)
            }else{

                const parser = new DOMParser()
                const pg = parser.parseFromString(data, 'text/html')
                fixLinks(pg)

                //Html and css
                contentElement.innerHTML = pg.body.innerHTML
                contentElement.append(pg.head)
                
                //Script
                for (const script of pg.scripts){
                    if (script.src){
                        fixLinks(script)
                        import(script.getAttribute('src'))
                    }
                }

                document.dispatchEvent(onPageChanged)
            }
        })
}

//lINK FIX
const fixLinks = (doc) => {
    if (doc instanceof HTMLScriptElement) {
        const scr = doc.getAttribute('src')
        if (scr.startsWith('/'))
            doc.setAttribute('src', sitePrefix + scr)
        return
    }

    const links = doc.querySelectorAll('[href]:not(route-to):not([is]), [data], [src]')
    links.forEach( link => {
        const attr = link.getAttributeNode('href') || link.getAttributeNode('data') || link.getAttributeNode('src')

        if (attr.value.startsWith('/'))
            link.setAttribute(attr.nodeName, sitePrefix + attr.value)
    })
}

//MAIN
fetchPage(curPage)
