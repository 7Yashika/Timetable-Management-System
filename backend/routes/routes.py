# from flask import Blueprint, request, jsonify
# from controller import timetable_controller
# from bson.objectid import ObjectId
# import requests as http_requests

# # ── Paste your deployed Apps Script URL here ──
# APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbynYn9XD9orYFwCx9zdLS9HEZfZDPrnnbUhb2IImp316658Gx0QQ3eE1oJguNG8uRwtHQ/exec"

# def notify_sheets(action, slot):
#     """Fire-and-forget call to Google Apps Script."""
#     try:
#         http_requests.post(
#             APPS_SCRIPT_URL,
#             json={
#                 "action": action,
#                 "data": {
#                     "batch":       slot.get("batch", ""),
#                     "subject":     slot.get("subject", ""),
#                     "subBatch":    slot.get("subBatch") or "-",
#                     "faculty":     slot.get("faculty", ""),
#                     "room_number": slot.get("room_number") or slot.get("room_id") or "-",
#                     "day":         slot.get("day", ""),
#                     "time":        slot.get("time", ""),
#                 }
#             },
#             timeout=10
#         )
#     except Exception as e:
#         print(f"[Sheets sync error] {e}")   # non-fatal — log and continue


# def construct_routes(db):
#     api = Blueprint('api', __name__)

#     @api.route('/sync', methods=['POST'])
#     def sync():
#         return timetable_controller.sync_sheet_data(db, request)

#     @api.route('/batches', methods=['GET', 'POST'])
#     def batches():
#         return timetable_controller.handle_batches(db, request)

#     @api.route('/faculties', methods=['GET', 'POST'])
#     def faculties():
#         return timetable_controller.handle_faculties(db, request)

#     @api.route('/rooms', methods=['GET', 'POST'])
#     def rooms():
#         return timetable_controller.handle_rooms(db, request)

#     @api.route('/labs', methods=['GET'])
#     def labs():
#         return timetable_controller.handle_labs(db, request)

#     # ── SLOTS ──
#     @api.route('/slots', methods=['GET', 'POST'])
#     def handle_slots():
#         if request.method == 'POST':
#             # delegate to controller (which already calls Sheets on create)
#             return timetable_controller.add_slot(db, request)

#         # GET — return all slots
#         slots = list(db.slots.find())
#         for s in slots:
#             s['_id'] = str(s['_id'])
#         return jsonify(slots)

#     @api.route('/slots/<slot_id>', methods=['DELETE'])
#     def delete_slot(slot_id):
#         # 1️⃣ Fetch the slot BEFORE deleting so we have all fields
#         slot = db.slots.find_one({"_id": ObjectId(slot_id)})
#         if not slot:
#             return jsonify({"error": "Slot not found"}), 404

#         # 2️⃣ Delete from MongoDB
#         db.slots.delete_one({"_id": ObjectId(slot_id)})

#         # 3️⃣ Sync deletion to Google Sheets
#         notify_sheets("delete", slot)

#         return jsonify({"message": "Deleted successfully"}), 200

#     @api.route('/slots/<slot_id>', methods=['PUT'])
#     def update_slot(slot_id):
#         return timetable_controller.modify_slot(db, request, slot_id)

#     @api.route('/batches/<batch_name>/schedule', methods=['GET'])
#     def get_batch_schedule(batch_name):
#         return timetable_controller.get_batch_schedule(db, batch_name)

#     @api.route('/subjects/search', methods=['GET'])
#     def search():
#         return timetable_controller.search_subjects(db, request)

#     return api

# from flask import Blueprint, request, jsonify
# from controller import timetable_controller
# from bson.objectid import ObjectId
# import requests as http_requests

# # ── Your deployed Apps Script URL ──
# APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbynYn9XD9orYFwCx9zdLS9HEZfZDPrnnbUhb2IImp316658Gx0QQ3eE1oJguNG8uRwtHQ/exec"

# def notify_sheets(action, slot):
#     """Send a single slot action (create/delete) to Google Sheets."""
#     try:
#         http_requests.post(APPS_SCRIPT_URL, json={
#             "action": action,
#             "data": {
#                 "batch":       slot.get("batch", ""),
#                 "subject":     slot.get("subject", ""),
#                 "subBatch":    slot.get("subBatch") or "-",
#                 "faculty":     slot.get("faculty", ""),
#                 "room_number": slot.get("room_number") or slot.get("room_id") or "-",
#                 "day":         slot.get("day", ""),
#                 "time":        slot.get("time", ""),
#             }
#         }, timeout=10)
#     except Exception as e:
#         print(f"[Sheets sync error] {e}")


# def construct_routes(db):
#     api = Blueprint('api', __name__)

#     @api.route('/sync', methods=['POST'])
#     def sync():
#         return timetable_controller.sync_sheet_data(db, request)

#     @api.route('/batches', methods=['GET', 'POST'])
#     def batches():
#         return timetable_controller.handle_batches(db, request)

#     @api.route('/faculties', methods=['GET', 'POST'])
#     def faculties():
#         return timetable_controller.handle_faculties(db, request)

#     @api.route('/rooms', methods=['GET', 'POST'])
#     def rooms():
#         return timetable_controller.handle_rooms(db, request)

#     @api.route('/labs', methods=['GET'])
#     def labs():
#         return timetable_controller.handle_labs(db, request)

#     # ── SLOTS ──
#     @api.route('/slots', methods=['GET', 'POST'])
#     def handle_slots():
#         if request.method == 'POST':
#             return timetable_controller.add_slot(db, request)
#         slots = list(db.slots.find())
#         for s in slots:
#             s['_id'] = str(s['_id'])
#         return jsonify(slots)

#     @api.route('/slots/<slot_id>', methods=['DELETE'])
#     def delete_slot(slot_id):
#         slot = db.slots.find_one({"_id": ObjectId(slot_id)})
#         if not slot:
#             return jsonify({"error": "Slot not found"}), 404
#         db.slots.delete_one({"_id": ObjectId(slot_id)})
#         notify_sheets("delete", slot)
#         return jsonify({"message": "Deleted successfully"}), 200

#     @api.route('/slots/<slot_id>', methods=['PUT'])
#     def update_slot(slot_id):
#         return timetable_controller.modify_slot(db, request, slot_id)

#     # ════════════════════════════════════════════
#     # FULL SYNC — clears sheets then rebuilds from MongoDB
#     # Call this once to fix stale/orphaned sheet data
#     # ════════════════════════════════════════════
#     @api.route('/sync-sheets', methods=['POST'])
#     def sync_sheets():
#         try:
#             # Step 1: wipe all 3 sheets
#             http_requests.post(APPS_SCRIPT_URL, json={"action": "clear_all"}, timeout=15)

#             # Step 2: re-create every slot currently in MongoDB
#             slots = list(db.slots.find())
#             for slot in slots:
#                 notify_sheets("create", slot)

#             return jsonify({"message": f"Synced {len(slots)} slots successfully"}), 200

#         except Exception as e:
#             return jsonify({"error": str(e)}), 500

#     @api.route('/batches/<batch_name>/schedule', methods=['GET'])
#     def get_batch_schedule(batch_name):
#         return timetable_controller.get_batch_schedule(db, batch_name)

#     @api.route('/subjects/search', methods=['GET'])
#     def search():
#         return timetable_controller.search_subjects(db, request)

#     return api
# from flask import Blueprint, request, jsonify
# from controller import timetable_controller
# from bson.objectid import ObjectId
# import requests as http_requests

# # ── Your deployed Apps Script URL ──
# APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbynYn9XD9orYFwCx9zdLS9HEZfZDPrnnbUhb2IImp316658Gx0QQ3eE1oJguNG8uRwtHQ/exec"


# # ════════════════════════════════════════════
# # SINGLE SOURCE OF TRUTH FOR SHEET PAYLOAD
# # Used for BOTH create and delete — guarantees exact text match
# # ════════════════════════════════════════════
# def build_sheet_data(slot):
#     return {
#         "batch":       slot.get("batch", ""),
#         "subject":     slot.get("subject", ""),
#         "subBatch":    slot.get("subBatch") or "-",
#         "faculty":     slot.get("faculty", ""),
#         "room_number": slot.get("room_number") or "-",   # ← NEVER fall back to room_id
#         "day":         slot.get("day", ""),
#         "time":        slot.get("time", ""),
#     }


# # ════════════════════════════════════════════
# # GOOGLE SHEETS NOTIFIER
# # ════════════════════════════════════════════
# def notify_sheets(action, slot):
#     """Send a single slot action (create/delete) to Google Sheets."""
#     try:
#         http_requests.post(APPS_SCRIPT_URL, json={
#             "action": action,
#             "data":   build_sheet_data(slot)   # ← always normalized
#         }, timeout=10)
#     except Exception as e:
#         print(f"[Sheets sync error] {e}")


# # ════════════════════════════════════════════
# # ROUTES
# # ════════════════════════════════════════════
# def construct_routes(db):
#     api = Blueprint('api', __name__)

#     @api.route('/sync', methods=['POST'])
#     def sync():
#         return timetable_controller.sync_sheet_data(db, request)

#     @api.route('/batches', methods=['GET', 'POST'])
#     def batches():
#         return timetable_controller.handle_batches(db, request)

#     @api.route('/faculties', methods=['GET', 'POST'])
#     def faculties():
#         return timetable_controller.handle_faculties(db, request)

#     @api.route('/rooms', methods=['GET', 'POST'])
#     def rooms():
#         return timetable_controller.handle_rooms(db, request)

#     @api.route('/labs', methods=['GET'])
#     def labs():
#         return timetable_controller.handle_labs(db, request)

#     # ── SLOTS ──
#     @api.route('/slots', methods=['GET', 'POST'])
#     def handle_slots():
#         if request.method == 'POST':
#             return timetable_controller.add_slot(db, request)
#         slots = list(db.slots.find())
#         for s in slots:
#             s['_id'] = str(s['_id'])
#         return jsonify(slots)

#     # ────────────────────────────────────────
#     # DELETE SLOT
#     # ────────────────────────────────────────
#     @api.route('/slots/<slot_id>', methods=['DELETE'])
#     def delete_slot(slot_id):
#         # Step 1: fetch slot BEFORE deleting
#         slot = db.slots.find_one({"_id": ObjectId(slot_id)})
#         if not slot:
#             return jsonify({"error": "Slot not found"}), 404

#         # Step 2: build normalized sheet payload BEFORE deleting from DB
#         sheet_data = build_sheet_data(slot)

#         # Step 3: delete from MongoDB
#         db.slots.delete_one({"_id": ObjectId(slot_id)})

#         # Step 4: sync deletion to Google Sheets using normalized payload
#         notify_sheets("delete", sheet_data)

#         return jsonify({"message": "Deleted successfully"}), 200

#     # ────────────────────────────────────────
#     # UPDATE SLOT
#     # ────────────────────────────────────────
#     @api.route('/slots/<slot_id>', methods=['PUT'])
#     def update_slot(slot_id):
#         return timetable_controller.modify_slot(db, request, slot_id)

#     # ════════════════════════════════════════════
#     # FULL SYNC — clears sheets then rebuilds from MongoDB
#     # Call this ONCE to fix any stale/orphaned sheet data
#     # ════════════════════════════════════════════
#     @api.route('/sync-sheets', methods=['POST'])
#     def sync_sheets():
#         try:
#             # Step 1: wipe all sheets via Apps Script clear_all action
#             http_requests.post(APPS_SCRIPT_URL, json={"action": "clear_all"}, timeout=15)

#             # Step 2: re-create every slot currently in MongoDB
#             slots = list(db.slots.find())
#             for slot in slots:
#                 notify_sheets("create", slot)   # build_sheet_data called inside notify_sheets

#             return jsonify({"message": f"Synced {len(slots)} slots successfully"}), 200

#         except Exception as e:
#             return jsonify({"error": str(e)}), 500

#     @api.route('/batches/<batch_name>/schedule', methods=['GET'])
#     def get_batch_schedule(batch_name):
#         return timetable_controller.get_batch_schedule(db, batch_name)

#     @api.route('/subjects/search', methods=['GET'])
#     def search():
#         return timetable_controller.search_subjects(db, request)

#     return api

from flask import Blueprint, request, jsonify
from controller import timetable_controller
from bson.objectid import ObjectId
import requests as http_requests

# ── Your deployed Apps Script URL ──
APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbynYn9XD9orYFwCx9zdLS9HEZfZDPrnnbUhb2IImp316658Gx0QQ3eE1oJguNG8uRwtHQ/exec"


# ════════════════════════════════════════════
# SINGLE SOURCE OF TRUTH FOR SHEET PAYLOAD
# ════════════════════════════════════════════
def build_sheet_data(slot, db=None):
    room_number = slot.get("room_number")

    # ✅ If room_number missing, look it up from rooms collection
    if not room_number and slot.get("room_id") and db is not None:
        try:
            room = db.rooms.find_one({"_id": ObjectId(slot["room_id"])})
            if room:
                room_number = room.get("room_number")
        except Exception:
            pass

    return {
        "batch":       slot.get("batch", ""),
        "subject":     slot.get("subject", ""),
        "subBatch":    slot.get("subBatch") or "-",
        "faculty":     slot.get("faculty", ""),
        "room_number": room_number if room_number else "-",
        "day":         slot.get("day", ""),
        "time":        slot.get("time", ""),
    }


# ════════════════════════════════════════════
# GOOGLE SHEETS NOTIFIER
# ════════════════════════════════════════════
def notify_sheets(action, sheet_data):
    """Send a single slot action (create/delete) to Google Sheets."""
    try:
        print(f"=== SHEETS SYNC [{action.upper()}] ===")
        print(sheet_data)
        print("=====================================")
        http_requests.post(APPS_SCRIPT_URL, json={
            "action": action,
            "data":   sheet_data
        }, timeout=10)
    except Exception as e:
        print(f"[Sheets sync error] {e}")


# ════════════════════════════════════════════
# ROUTES
# ════════════════════════════════════════════
def construct_routes(db):
    api = Blueprint('api', __name__)

    @api.route('/sync', methods=['POST'])
    def sync():
        return timetable_controller.sync_sheet_data(db, request)

    @api.route('/batches', methods=['GET', 'POST'])
    def batches():
        return timetable_controller.handle_batches(db, request)

    @api.route('/faculties', methods=['GET', 'POST'])
    def faculties():
        return timetable_controller.handle_faculties(db, request)

    @api.route('/rooms', methods=['GET', 'POST'])
    def rooms():
        return timetable_controller.handle_rooms(db, request)

    @api.route('/labs', methods=['GET'])
    def labs():
        return timetable_controller.handle_labs(db, request)

    # ────────────────────────────────────────
    # SLOTS — GET ALL / POST NEW
    # ────────────────────────────────────────
    @api.route('/slots', methods=['GET', 'POST'])
    def handle_slots():
        if request.method == 'POST':
            return timetable_controller.add_slot(db, request)
        slots = list(db.slots.find())
        for s in slots:
            s['_id'] = str(s['_id'])
        return jsonify(slots)

    # ────────────────────────────────────────
    # DELETE SLOT
    # ────────────────────────────────────────
    @api.route('/slots/<slot_id>', methods=['DELETE'])
    def delete_slot(slot_id):
        # Step 1: fetch slot BEFORE deleting
        slot = db.slots.find_one({"_id": ObjectId(slot_id)})
        if not slot:
            return jsonify({"error": "Slot not found"}), 404

        # Step 2: build normalized sheet payload
        # Pass db so room_number can be looked up if missing
        sheet_data = build_sheet_data(slot, db)

        # Step 3: delete from MongoDB
        db.slots.delete_one({"_id": ObjectId(slot_id)})

        # Step 4: sync deletion to ALL 3 sheets
        notify_sheets("delete", sheet_data)

        return jsonify({"message": "Deleted successfully"}), 200

    # ────────────────────────────────────────
    # UPDATE SLOT
    # ────────────────────────────────────────
    @api.route('/slots/<slot_id>', methods=['PUT'])
    def update_slot(slot_id):
        return timetable_controller.modify_slot(db, request, slot_id)

    # ════════════════════════════════════════════
    # FULL SYNC — wipe sheets then rebuild from MongoDB
    # Call this ONCE to fix any stale/orphaned data
    # ════════════════════════════════════════════
    @api.route('/sync-sheets', methods=['POST'])
    def sync_sheets():
        try:
            # Step 1: wipe all 3 sheets
            http_requests.post(
                APPS_SCRIPT_URL,
                json={"action": "clear_all"},
                timeout=15
            )

            # Step 2: re-create every slot from MongoDB
            slots = list(db.slots.find())
            for slot in slots:
                sheet_data = build_sheet_data(slot, db)  # ✅ pass db for room lookup
                notify_sheets("create", sheet_data)

            return jsonify({
                "message": f"Synced {len(slots)} slots successfully"
            }), 200

        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @api.route('/batches/<batch_name>/schedule', methods=['GET'])
    def get_batch_schedule(batch_name):
        return timetable_controller.get_batch_schedule(db, batch_name)

    @api.route('/subjects/search', methods=['GET'])
    def search():
        return timetable_controller.search_subjects(db, request)

    return api