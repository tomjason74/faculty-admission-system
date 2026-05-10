<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DocumentController extends Controller
{
    public function download(Request $request, Media $media): StreamedResponse
    {
        $user = $request->user();
        
        $isAdmin = $user && $user->hasRole('admin');
        
        $profile = $user ? $user->facultyProfile : null;
        $isOwner = $profile && $media->model_type === get_class($profile) && $media->model_id === $profile->id;

        if (!$isAdmin && !$isOwner) {
            abort(403, 'Unauthorized access to this document.');
        }

        return response()->streamDownload(function () use ($media) {
            $stream = $media->stream();
            while (!feof($stream)) {
                echo fread($stream, 1024);
            }
            fclose($stream);
        }, $media->file_name, [
            'Content-Type' => $media->mime_type,
        ]);
    }

    public function destroy(Request $request, Media $media)
    {
        $user = $request->user();
        $isAdmin = $user && $user->hasRole('admin');
        
        $profile = $user ? $user->facultyProfile : null;
        $isOwner = $profile && $media->model_type === get_class($profile) && $media->model_id === $profile->id;

        if (!$isAdmin && !$isOwner) {
            abort(403, 'Unauthorized to delete this document.');
        }

        $media->delete();

        return redirect()->back()->with('success', 'Document deleted successfully.');
    }
}
