/**
 * =========================================================================
 * TWO247 Admin — Firestore Real Data Database Service
 * Provides full CRUD operations syncing directly with Google Cloud Firestore
 * Wraps and exposes the unified data service
 * =========================================================================
 */
export {
  getPackages,
  savePackage,
  deletePackage,
  getDestinations,
  saveDestination,
  deleteDestination,
  getReviews,
  saveReview,
  deleteReview,
  getInquiries,
  updateInquiryStatus,
  deleteInquiry,
  getGalleryItems,
  saveGalleryItem,
  deleteGalleryItem,
  syncAllToFirestore,
  getLocalCache,
  setLocalCache
} from "../../js/data-service.js";
