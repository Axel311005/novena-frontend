import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-base font-medium font-sans transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/40 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/30 hover:from-orange-600 hover:to-orange-700 hover:shadow-lg hover:shadow-orange-500/40 rounded-lg transition-all duration-200',
        destructive:
          'bg-red-500 text-white shadow-md shadow-red-500/20 hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/30',
        outline: 'border-2 border-gray-300 bg-transparent text-gray-700 hover:bg-orange-500/10 hover:border-orange-500/40 hover:text-orange-500 transition-all duration-200',
        secondary:
          'bg-gray-100 text-gray-700 hover:bg-gray-200',
        ghost: 'text-gray-700 hover:bg-orange-500/10 hover:text-orange-500 transition-all duration-200',
        link: 'text-orange-500 underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3 text-xs',
        lg: 'h-12 rounded-lg px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };

