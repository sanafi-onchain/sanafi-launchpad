import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { cn } from '@/lib/utils';

interface IProps {
  containerClassName?: string;
  pageClassName?: string;
  isLogin?: boolean;
}

const Page: React.FC<React.PropsWithChildren<IProps>> = ({
  containerClassName,
  children,
  pageClassName,
  isLogin,
}) => {
  return (
    <div
      className={cn(
        'flex min-h-screen flex-col justify-between bg-background text-foreground',
        pageClassName
      )}
    >
      <Header isLogin={isLogin} />
      <div
        className={cn(
          'flex flex-1 flex-col items-center px-1 md:px-3 pt-4 pb-16',
          containerClassName
        )}
      >
        <div className="lg:max-w-7xl w-full">{children}</div>
      </div>
      <Footer />
    </div>
  );
};

export default Page;
