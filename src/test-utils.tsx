import { type PropsWithChildren, type ReactElement } from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

interface WrapperOptions {
  initialEntries?: string[]
}

export function createWrapper({ initialEntries = ['/'] }: WrapperOptions = {}) {
  return function Wrapper({ children }: PropsWithChildren) {
    return <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
  }
}

export function renderWithRouter(
  ui: ReactElement,
  options?: WrapperOptions & Omit<RenderOptions, 'wrapper'>
) {
  const { initialEntries, ...renderOptions } = options ?? {}
  return render(ui, { wrapper: createWrapper({ initialEntries }), ...renderOptions })
}
