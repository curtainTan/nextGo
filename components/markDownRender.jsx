import MarkDown from "markdown-it"
import { memo, useMemo } from "react"
import "github-markdown-css"

const md = new MarkDown({
    html: true,
    linkify: true,
})

function b64_to_utf8( str ){
    return decodeURIComponent( escape( atob( str ) ) )
}

export default memo(function MarkdownRender({ content, isBase64 }){

    const markdown = isBase64 ? b64_to_utf8( content ) : content
    const html = useMemo( () => md.render( markdown ), [ markdown ] )

    return (
        <div className="markdown-body">
            <div dangerouslySetInnerHTML = {{ __html: html }} ></div>
        </div>
    )
})

