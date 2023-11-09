import { scrap } from '@/etsy/scraping';

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    const data = await scrap();
    return Response.json(data);
}