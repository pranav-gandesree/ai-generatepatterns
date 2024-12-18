import React from 'react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

interface Pattern {
  pattern: string;
  details: string;
}

interface PatternAccordionProps {
  patterns: Pattern[];
}

const PatternDisplayAccordion: React.FC<PatternAccordionProps> = ({ patterns }) => {
  return (
    <Accordion type="single" collapsible>
      {patterns?.map((item, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger className="cursor-pointer p-4 rounded-md shadow-md">
            <h4 className="font-bold no-underline">{item.pattern}</h4>
          </AccordionTrigger>
          <AccordionContent className="p-4 rounded-md shadow-inner mt-2">
            <p>{item.details}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default PatternDisplayAccordion;
