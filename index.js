//Name: Mukesh Viswanathan
//multiple
const links = [ { "name": "reddit", "url": "https://www.reddit.com/r/ProgrammerHumor/comments/j96xeo/id_still_need_a_2nd_monitor/?utm_source=share&utm_medium=web2x&context=3"},
  { "name": "Youtube", "url": "https://www.youtube.com/watch?v=7H6doOmS-eM" },
  { "name": "Cloudflare", "url": "https://developers.cloudflare.com/workers/examples/aggregate-requests" }
]
addEventListener("fetch", event => {
  return event.respondWith(handleRequest(event));
});
//color gray

//links on display. Error on picture icon.
class linksTransformer {
  constructor(links) {
    this.links = links
  }

  async element(element) {
    links.forEach(link => {
      element.append(`<a href="${link.url}">${link.name}</a>`, { html: true });
    })
  }

}



class followmeTransformer {
  async element(element) {
    element.removeAttribute('style'); 
    element.append("<a href=\"https://www.linkedin.com/in/mukeshvi?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3Bn%2B83gb5OQvOKoJirW8y9wg%3D%3D\"><img src=\"https://www.flaticon.com/svg/static/icons/svg/61/61109.svg\"></a>", { html: true })
    element.append("<a href=\"https://github.com/muks97\"><img src=\"https://www.flaticon.com/svg/static/icons/svg/37/37318.svg\"></a>", { html: true })
  }
}

async function handleRequest(event) {
  const url = new URL(event.request.url);
  let element = url.pathname.split("/").filter(n => n);
  //check parse links. If /Links exist return attributes from json
  if (element[0] === "links") {
    const json = JSON.stringify(links, null, 2);
    return new Response(json, {
      headers: {
        "content-type": "application/json;charset=UTF-8"
      }
    })

  } else if (element[0] === undefined) {
    const headers = {
      headers: {
        "content-type": "text/html;charset=UTF-8"
      },
    }
//workers.dev
    const Response = await fetch("https://static-links-page.signalnerve.workers.dev/", headers)

    return new HTMLRewriter()
    .on("div#links", new linksTransformer())
    .on("div#profile", { element: (element) => element.removeAttribute("style") })
    .on("h1#name",{ element: (element) => element.setInnerContent("Mukesh Viswanathan") })
    .on("div#social", new followmeTransformer())
    .on("title", { element: (element) => element.setInnerContent("Mukesh Viswanathan") })
    .on("body", { element: (element) => element.setAttribute("class", "bg-gray-500") })
    .transform(Response);
  } else {
    return new Response("Error 404", { status: "404" });
  }
}