import { NextResponse } from 'next/server'
import stream2buffer from '@/app/lib/stream-to-buffer';

export async function POST(req: Request) {
    const file = req.body;
    const allHighlights: any = {};
    const fileBuffer = await stream2buffer(file);
    
    const data = fileBuffer.toString('utf-8')

    const highlightWithMeta = data.split('==========');

    for (let highlight of highlightWithMeta) {
        const highlightFiltered = highlight.replace(' ', '').split("\r\n").filter(x => x !== '');

        if(highlightFiltered[0]) {
            if (!allHighlights[highlightFiltered[0]]) {
                allHighlights[highlightFiltered[0]] = []
            }

            
            allHighlights[highlightFiltered[0]].push(highlightFiltered[2])
        }

    }

    const titles = Object.keys(allHighlights);
    const highlightData = titles.reduce((acc: any, curr: any) => {
        return [...acc, { title: curr, highlights: allHighlights[curr] }]
    }, [])

    return NextResponse.json({
        data: highlightData
    })
  }
  