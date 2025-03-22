import React from 'react';
import TextBlock from './blocks/TextBlock';
import HeadingBlock from './blocks/HeadingBlock';
import BulletListBlock from './blocks/BulletListBlock';
import NumberedListBlock from './blocks/NumberedListBlock';
import QuoteBlock from './blocks/QuoteBlock';
import CodeBlock from './blocks/CodeBlock';
import ImageBlock from './blocks/ImageBlock';
import DividerBlock from './blocks/DividerBlock';

const BlockRenderer = ({ block, onKeyDown, setQuillRef, ...props }) => {
  if (!block || !block.id) {
    console.error('Invalid block:', block);
    return null;
  }
  console.log('Rendering block:', block);

  switch (block.type) {
    case 'text':
    case 'paragraph':
      return <TextBlock key={block.id} block={block} onKeyDown={onKeyDown} setQuillRef={setQuillRef} {...props} />;
    case 'heading':
    case 'heading_1':
      return <HeadingBlock key={block.id} block={block} onKeyDown={onKeyDown} setQuillRef={setQuillRef} {...props} />;
    case 'bullet':
    case 'bulleted_list':
      return <BulletListBlock key={block.id} block={block} onKeyDown={onKeyDown} setQuillRef={setQuillRef} {...props} />;
    case 'numbered':
    case 'numbered_list':
      return <NumberedListBlock key={block.id} block={block} onKeyDown={onKeyDown} setQuillRef={setQuillRef} {...props} />;
    case 'quote':
      return <QuoteBlock key={block.id} block={block} onKeyDown={onKeyDown} setQuillRef={setQuillRef} {...props} />;
    case 'code':
      return <CodeBlock key={block.id} block={block} onKeyDown={onKeyDown} setQuillRef={setQuillRef} {...props} />;
    case 'image':
      return <ImageBlock key={block.id} block={block} {...props} />;
    case 'divider':
      return <DividerBlock key={block.id} block={block} {...props} />;
    default:
      console.warn(`Unknown block type: ${block.type}, rendering as text`);
      return <TextBlock key={block.id} block={block} onKeyDown={onKeyDown} setQuillRef={setQuillRef} {...props} />;
  }
};

export default BlockRenderer;