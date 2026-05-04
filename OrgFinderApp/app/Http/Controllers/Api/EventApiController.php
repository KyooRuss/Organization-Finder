<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;

class EventApiController extends Controller
{
    public function upcoming(Request $request)
    {
        $query = Event::with('organization')
            ->where('status', 'approved')
            ->where('date', '>=', now()->toDateString());

        if ($search = $request->query('search')) {
            $query->where('title', 'like', "%{$search}%");
        }

        if ($category = $request->query('category')) {
            $query->whereHas('organization', fn($q) => $q->where('category', $category));
        }

        $events = $query->orderBy('date')->get();

        return response()->json(['events' => $events->map(fn($e) => $this->eventResource($e))]);
    }

    public function show($id)
    {
        $event = Event::with(['organization', 'gains'])->findOrFail($id);

        return response()->json(['event' => $this->eventDetailResource($event)]);
    }

    private function eventResource(Event $event): array
    {
        return [
            'id'           => $event->id,
            'title'        => $event->title,
            'date'         => $event->date->format('D, M j, Y'),
            'start_time'   => $event->start_time,
            'end_time'     => $event->end_time,
            'location'     => $event->location,
            'poster'       => $event->poster ? asset('storage/' . $event->poster) : null,
            'organization' => [
                'id'   => $event->organization->id,
                'name' => $event->organization->name,
            ],
        ];
    }

    private function eventDetailResource(Event $event): array
    {
        return [
            'id'           => $event->id,
            'title'        => $event->title,
            'description'  => $event->description,
            'date'         => $event->date->format('D, M j, Y'),
            'start_time'   => $event->start_time,
            'end_time'     => $event->end_time,
            'location'     => $event->location,
            'poster'       => $event->poster ? asset('storage/' . $event->poster) : null,
            'gains'        => $event->gains->pluck('gain')->values(),
            'organization' => [
                'id'       => $event->organization->id,
                'name'     => $event->organization->name,
                'logo'     => $event->organization->logo
                    ? asset('storage/' . $event->organization->logo)
                    : null,
                'category' => $event->organization->category,
            ],
        ];
    }
}
