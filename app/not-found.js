import dynamic from 'next/dynamic';

const NotFoundClient = dynamic(() => import('@/components/NotFoundClient'), { ssr: false });

export default function NotFound() {
    return <NotFoundClient />;
}
