(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const n of s.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&i(n)}).observe(document,{childList:!0,subtree:!0});function e(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=e(r);fetch(r.href,s)}})();const o={API_KEY:"fa2d6fc2ca5f1b892bcbf9f3205576c8",API_BASE_URL:"https://gnews.io/api/v4/search",ARTICLES_LIMIT:20,KEYWORDS:["laravel","javascript","artificial intelligence","AI tools"]};console.log("Esta config biene del api",o);class l{constructor(){this.newsGrid=document.getElementById("news-grid"),this.filterButtons=document.querySelectorAll(".filter-btn"),this.currentFilter="all",this.articles=[],this.isLoading=!1,this.init()}init(){this.setupEventListeners(),this.fetchNews()}setupEventListeners(){this.filterButtons.forEach(t=>{t.addEventListener("click",()=>{const e=t.dataset.category;this.updateFilter(e,t)})})}updateFilter(t,e){this.currentFilter=t,this.filterButtons.forEach(i=>i.classList.remove("active")),e.classList.add("active"),this.renderArticles()}async fetchNews(){this.isLoading=!0,this.renderSkeletons();try{const t=o.KEYWORDS.join(" OR "),e=`${o.API_BASE_URL}?q=${encodeURIComponent(t)}&max=${o.ARTICLES_LIMIT}&lang=en&apikey=${o.API_KEY}`,r=await(await fetch(e)).json();if(!r.articles)throw new Error("Invalid API response");if(r.status==="error")throw new Error(r.message||"API Error");this.articles=r.articles||[],this.isLoading=!1,this.renderArticles()}catch(t){console.error("Error fetching news:",t),this.renderError(t.message),this.isLoading=!1}}getCategoryFromContent(t){const e=(t.title+" "+t.description).toLowerCase();return e.includes("laravel")?"laravel":e.includes("javascript")||e.includes("js")?"javascript":e.includes("ai")||e.includes("intelligence")||e.includes("gpt")?"ai":"general"}renderSkeletons(){this.newsGrid.innerHTML="";for(let t=0;t<6;t++){const e=document.createElement("div");e.className="skeleton-card skeleton",this.newsGrid.appendChild(e)}}renderError(t){this.newsGrid.innerHTML=`
            <div class="error-container">
                <h2>Ouch! Something went wrong</h2>
                <p>${t}</p>
                <button class="retry-btn" onclick="location.reload()">Try Again</button>
            </div>
        `}renderArticles(){const t=this.currentFilter==="all"?this.articles:this.articles.filter(e=>this.getCategoryFromContent(e)===this.currentFilter);if(t.length===0&&!this.isLoading){this.newsGrid.innerHTML=`
                <div class="error-container">
                    <h2>No articles found</h2>
                    <p>Try refreshing or selecting a different category.</p>
                </div>
            `;return}this.newsGrid.innerHTML="",t.forEach((e,i)=>{if(i>0&&i%5===0){const a=document.createElement("div");a.className="in-grid-ad",a.innerHTML="<span>Sponsor Advertisement Showcase</span>",this.newsGrid.appendChild(a)}const r=this.getCategoryFromContent(e),s=i%2!==0,n=document.createElement("article");n.className=`news-card ${s?"dark-card":""}`,n.innerHTML=`
                <img src="${e.image||"https://via.placeholder.com/400x220?text=News+Thumbnail"}" 
                     alt="${e.title}" 
                     class="card-image"
                     onerror="this.src='https://via.placeholder.com/400x220?text=No+Image'">
                <div class="card-content">
                    <span class="category-badge badge-${r}">${r}</span>
                    <h3 class="card-title">${e.title}</h3>
                    <p class="card-description">${e.description||"Click to read the full story on the original website."}</p>
                    <div class="card-footer">
                        <div class="author-info">
                            <span>${e.author||"MyCatNotice Staff"}</span>
                        </div>
                        <span class="read-more">Read Story &rarr;</span>
                    </div>
                </div>
            `,n.addEventListener("click",()=>{window.open(e.url,"_blank")}),this.newsGrid.appendChild(n)})}}document.addEventListener("DOMContentLoaded",()=>{new l});
