import { useEffect, useState } from "react";
import { checkHeading, replaceHeadingStar } from "../helper";
import ReactMarkdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter/dist/cjs/light";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";

const Answer = ({ans,totalResult,index,type})=>{

  const [heading , setHeading] = useState(false)
   const [answer , setAnswer] = useState(ans)

// console.log(totalResult, index );
 


useEffect(()=>{
if(checkHeading(ans)){
  setHeading(true);
  setAnswer(replaceHeadingStar(ans))

}

},[])

const renderer={
  code({node,inline,className,children,...props}){
    const match = /language-(\w+)/.exec(className || '');
    return !inline &&match?(
      <SyntaxHighlighter
      {...props}
      children={String(children).replace(/\n$/,'')}
      language={match[1]}
      style={dark}
      preTag="div"
      />
    ):(
      <code {...props} className={className} >
        {children}
      </code>
    )
  }
}

return(
    <div> 

       {
        index==0 && totalResult>1?<span className=" text-lg pt-3 block dark:text-white text-black">{answer}</span>:
         heading?<span className=" text-lg pt-3 block dark:text-zinc-200 text-zinc-900">
          <ReactMarkdown components={renderer}>{answer}</ReactMarkdown>
         </span>:
        <span className={type=='q'?'pl-1':'pl-5 dark:text-white '}>
          
          {answer}</span>
       }
       
       
    </div>
)
   
}

export default Answer