import React from 'react'
import { Fragment, useRef, useState } from 'react'
import { Deferred } from 'ts-deferred'

// Similar to window.prompt() but you can render any react component and return any value.
type RenderPrompt<Props = unknown, Response = unknown> = (
  renderProps: Props,
  answer: (userResponse: Response) => void,
) => React.ReactNode

const NullOutlet = () => <>{null}</>

export const usePrompt = <Response, PromptProps = unknown>() => {
  const [Outlet, setOutlet] = useState<React.FC<PromptProps> | null>(null)

  const deferredRef = useRef<Deferred<Response> | null>(null)

  const clear = () => {
    setOutlet(null)
    deferredRef.current = null
  }

  const answer = (userResponse: Response) => {
    deferredRef.current?.promise.then(clear)
    deferredRef.current?.resolve(userResponse)
  }

  const render = (renderPrompt: RenderPrompt<PromptProps, Response>) => {
    const NewOutlet = () => (props: PromptProps) => {
      return (
        <Fragment>
          {renderPrompt(props, answer)}
        </Fragment>
      )
    }

    setOutlet(NewOutlet)

    deferredRef.current = new Deferred<Response>()

    return deferredRef.current.promise
  }

  const prompt = {
    Outlet: Outlet ?? NullOutlet,
    render,
    clear,
    isActive: !!Outlet && !!deferredRef.current
  }

  return prompt
}
