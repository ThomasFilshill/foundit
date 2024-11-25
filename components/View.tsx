import { STARTUP_VIEWS_QUERY } from "@/sanity/lib/queries";
import Ping from "./Ping"
import { client } from '@/sanity/lib/client';
import { writeClient } from "@/sanity/lib/write-client";
import { unstable_after as after } from 'next/server';


const View = async ({ id }: { id: string }) => {

    const { views: totalViews } = await client
    .withConfig({ useCdn: false })
    .fetch(STARTUP_VIEWS_QUERY, { id });

    // It is not necessary to update the views before loading the page. We use the after function to update the views after the page has loaded.
    after( async () => {
        await writeClient
        .patch(id)
        .set({ views: totalViews + 1 })
        .commit();
    });

    return <div className="view-container">
        <div className="absolute -top-2 -right-2">
            <Ping />
        </div>
        <p className="view-text">
            <span className="font-black">{views_string(totalViews)}</span>
        </p>
    </div>
}

function views_string(views: number) {
    return `${views} view${views !== 1 ? 's' : ''}`;
}

export default View