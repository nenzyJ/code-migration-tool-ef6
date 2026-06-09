import * as React from 'react';
import {Pagination} from '@shopify/hydrogen';

/**
 * <PaginatedResourceSection > is a component that encapsulate how the previous and next behaviors throughout your application.
 */
export function PaginatedResourceSection<NodesType>({
  connection,
  children,
  resourcesClassName,
}: {
  connection: React.ComponentProps<typeof Pagination<NodesType>>['connection'];
  children: React.FunctionComponent<{node: NodesType; index: number}>;
  resourcesClassName?: string;
}) {
  return (
    <Pagination connection={connection}>
      {({nodes, isLoading, PreviousLink, NextLink}) => {
        const resourcesMarkup = nodes.map((node, index) =>
          children({node, index}),
        );

        return (
          <div className="flex flex-col items-center gap-10">
            <PreviousLink className="inline-flex items-center justify-center px-8 py-3 border-2 border-agro-green text-agro-green hover:bg-agro-green hover:text-white transition-colors rounded font-semibold text-sm tracking-[0.7px]">
              {isLoading ? 'Завантаження...' : '↑ Попередні товари'}
            </PreviousLink>
            
            {resourcesClassName ? (
              <div className={`w-full ${resourcesClassName}`}>{resourcesMarkup}</div>
            ) : (
              <div className="w-full">{resourcesMarkup}</div>
            )}
            
            <NextLink className="inline-flex items-center justify-center px-8 py-3 bg-agro-green text-white hover:bg-[#023d27] transition-colors rounded font-semibold text-sm tracking-[0.7px]">
              {isLoading ? 'Завантаження...' : 'Показати ще ↓'}
            </NextLink>
          </div>
        );
      }}
    </Pagination>
  );
}
