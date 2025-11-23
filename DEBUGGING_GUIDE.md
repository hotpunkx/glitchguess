# GLITCHGUESS Debugging Guide

## White Page Issues

### Multiplayer Game Page White Screen

**Symptoms:**
- Accessing `/multiplayer/game/:gameId?code=XXXXXX` shows a blank white page
- No error messages visible to user
- Page appears to load but shows nothing

**Root Causes & Solutions:**

#### 1. Missing Player Session
**Cause:** Player's session ID doesn't match either player1_session or player2_session in the database.

**How to Check:**
```javascript
// Open browser console and run:
localStorage.getItem('multiplayer-session')
// Compare with database values for player1_session and player2_session
```

**Solution:**
- The page now shows a fallback UI: "GAME IN PROGRESS" message
- User can click "BACK TO HOME" button
- This prevents white screen for spectators or invalid sessions

#### 2. Game Status vs Player Number Mismatch
**Cause:** Game is in 'active' status but playerNumber is null.

**Fixed in Code:**
```typescript
// Before (caused white screen):
if (game.game_status === 'active' && playerNumber) {
  return <MultiplayerGameplay ... />;
}
return null; // ❌ White screen!

// After (shows fallback):
if (game.game_status === 'active' && playerNumber) {
  return <MultiplayerGameplay ... />;
}
// Fallback UI for spectators/invalid states
return <div>GAME IN PROGRESS message</div>; // ✅ User-friendly
```

#### 3. Database Connection Issues
**Cause:** Supabase query fails silently.

**How to Check:**
```javascript
// Open browser console and look for:
console.log('Loading game:', gameId);
console.log('Game data loaded:', gameData);
console.error('Error loading game:', error);
```

**Solution:**
- Added comprehensive error logging
- Toast notifications for errors
- Automatic redirect to home after 2 seconds on error

#### 4. Real-time Subscription Errors
**Cause:** Supabase Realtime subscription fails.

**How to Check:**
```javascript
// Console should show:
console.log('Game updated:', updatedGame);
```

**Solution:**
- Proper cleanup of subscriptions on unmount
- Error handling in subscription callbacks
- Graceful degradation if realtime fails

### General Debugging Steps

1. **Open Browser Console** (F12 or Cmd+Option+I)
   - Check for JavaScript errors (red text)
   - Look for console.log messages
   - Check Network tab for failed requests

2. **Check localStorage**
   ```javascript
   // In console:
   localStorage.getItem('multiplayer-session')
   localStorage.getItem('gameState')
   ```

3. **Verify Database State**
   - Check Supabase dashboard
   - Verify game exists with correct ID
   - Check game_status field
   - Verify player sessions match

4. **Test Real-time Connection**
   ```javascript
   // In console, check for Supabase errors:
   // Look for "realtime" or "subscription" errors
   ```

5. **Clear Cache and Reload**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Clear localStorage: `localStorage.clear()`
   - Close and reopen browser

## Common Error Messages

### "Game not found"
**Cause:** Invalid game ID in URL or game was deleted.

**Solution:** 
- Check URL for typos
- Verify game exists in database
- Create a new game

### "Failed to load game"
**Cause:** Database connection error or network issue.

**Solution:**
- Check internet connection
- Verify Supabase is running
- Check browser console for specific error

### "Failed to join game"
**Cause:** Game already has 2 players or is no longer in 'waiting' status.

**Solution:**
- Check game status in database
- Create a new game instead

### "Failed to answer question"
**Cause:** Database update failed or question doesn't exist.

**Solution:**
- Check browser console for specific error
- Verify question exists in database
- Refresh page and try again

## Performance Issues

### Slow Real-time Updates
**Symptoms:** Questions/answers take several seconds to appear.

**Causes:**
- Network latency
- Supabase server load
- Too many active subscriptions

**Solutions:**
- Check network speed
- Verify Supabase status
- Close other tabs/applications

### Memory Leaks
**Symptoms:** Page becomes slow after playing multiple games.

**Causes:**
- Subscriptions not cleaned up
- Event listeners not removed

**Solutions:**
- Refresh page between games
- Check for console warnings
- Report issue if persistent

## Testing Multiplayer Locally

### Two Browser Method
1. Open game in Chrome
2. Open same game URL in Firefox (or Chrome Incognito)
3. Both browsers should see updates in real-time

### Two Device Method
1. Create game on desktop
2. Copy link and open on mobile
3. Test gameplay between devices

### Debugging Real-time Sync
```javascript
// Add to MultiplayerGamePage.tsx for debugging:
useEffect(() => {
  console.log('Game state changed:', game);
}, [game]);

useEffect(() => {
  console.log('Questions updated:', history);
}, [history]);
```

## Reporting Issues

When reporting bugs, please include:

1. **Browser & Version:** Chrome 120, Firefox 121, etc.
2. **Device:** Desktop, Mobile, Tablet
3. **URL:** Full URL including game ID and code
4. **Console Errors:** Copy/paste from browser console
5. **Steps to Reproduce:** What you did before the error
6. **Expected vs Actual:** What should happen vs what happened
7. **Screenshots:** If applicable

## Quick Fixes

### Reset Everything
```javascript
// In browser console:
localStorage.clear();
location.reload();
```

### Force New Session
```javascript
// In browser console:
localStorage.removeItem('multiplayer-session');
location.reload();
```

### Check Game State
```javascript
// In browser console:
fetch('YOUR_SUPABASE_URL/rest/v1/multiplayer_games?id=eq.GAME_ID', {
  headers: {
    'apikey': 'YOUR_ANON_KEY',
    'Authorization': 'Bearer YOUR_ANON_KEY'
  }
}).then(r => r.json()).then(console.log);
```

## Prevention Tips

1. **Always use the full shareable link** - Don't manually type game IDs
2. **Don't refresh during critical moments** - Wait for actions to complete
3. **Keep browser updated** - Use latest version for best compatibility
4. **Stable internet connection** - Real-time features need good connectivity
5. **One game at a time** - Don't open multiple games in same browser

## Advanced Debugging

### Enable Verbose Logging
Add to `multiplayerApi.ts`:
```typescript
const DEBUG = true;

function log(...args: any[]) {
  if (DEBUG) console.log('[Multiplayer]', ...args);
}

// Use throughout code:
log('Creating game with code:', gameCode);
log('Question added:', questionData);
```

### Monitor Supabase Realtime
```typescript
supabase.channel('debug')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'multiplayer_games' },
    (payload) => console.log('Game changed:', payload)
  )
  .subscribe();
```

### Check Network Requests
1. Open DevTools → Network tab
2. Filter by "supabase"
3. Look for failed requests (red)
4. Check request/response details

## Contact & Support

For persistent issues:
- Check GitHub Issues
- Contact developer on X: @IamIsPra
- Review documentation: MULTIPLAYER_FEATURE.md
