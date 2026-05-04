<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventGain extends Model
{
    protected $fillable = ['event_id', 'gain', 'order_index'];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }
}
